'use server';

import { prisma } from '@/lib/prisma';
import { getUserSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

async function checkAuth() {
  const session = await getUserSession();
  if (!session || (session.role !== 'ADMIN' && !(session.role === 'VOCAL' && (session.vocalia === 'sudaderas' || session.vocalia === 'tienda')))) {
    throw new Error('No autorizado');
  }
  return session;
}

export async function getShopSettingsAction() {
  const settings = await prisma.shopSetting.findMany();
  return settings.reduce((acc: Record<string, string>, s) => ({ ...acc, [s.key]: s.value }), {});
}

export async function updateShopSettingAction(key: string, value: string) {
  await checkAuth();
  await prisma.shopSetting.upsert({
    where: { key },
    update: { value },
    create: { key, value },
  });
  revalidatePath('/admin/tienda');
  revalidatePath('/tienda');
  return { success: true };
}

export async function getProductVariantsAction(productId: string) {
  return await prisma.shopVariant.findMany({
    where: { productId },
    orderBy: [{ size: 'asc' }, { color: 'asc' }],
  });
}

interface VariantUpdateInput {
  size?: string;
  color?: string;
  type?: string;
  lining?: string;
  stock: number | string;
}

export async function updateProductVariantsAction(productId: string, variants: VariantUpdateInput[]) {
  await checkAuth();

  // Eliminar variantes antiguas
  await prisma.shopVariant.deleteMany({
    where: { productId },
  });

  await prisma.shopVariant.createMany({
    data: variants.map(v => ({
      productId,
      size: v.size || null,
      color: v.color || null,
      type: v.type || null,
      lining: v.lining || null,
      stock: typeof v.stock === 'string' ? parseInt(v.stock) : v.stock,
    })),
  });

  revalidatePath('/admin/tienda');
  revalidatePath('/tienda');
  return { success: true };
}

export async function createProductAction(formData: FormData) {
  await checkAuth();

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const category = formData.get('category') as string;
  const sizes = formData.get('sizes') as string;
  const imageFile = formData.get('imageFile') as File | null;

  let imageUrl = null;

  if (imageFile && imageFile.size > 0) {
    const uploadDir = path.join(process.cwd(), 'public/uploads/tienda');
    await fs.mkdir(uploadDir, { recursive: true });
    const filename = `${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    await fs.writeFile(path.join(uploadDir, filename), buffer);
    imageUrl = `/uploads/tienda/${filename}`;
  }

  const product = await prisma.shopProduct.create({
    data: {
      name,
      description,
      price,
      category,
      sizes,
      imageUrl,
    },
  });

  revalidatePath('/admin/tienda');
  revalidatePath('/tienda');
  return { success: true, product };
}

export async function updateProductAction(id: string, formData: FormData) {
  await checkAuth();

  const name = formData.get('name') as string;
  const description = formData.get('description') as string;
  const price = parseFloat(formData.get('price') as string);
  const category = formData.get('category') as string;
  const sizes = formData.get('sizes') as string;
  const imageFile = formData.get('imageFile') as File | null;
  const removeImage = formData.get('removeImage') === 'true';

  const currentProduct = await prisma.shopProduct.findUnique({ where: { id } });
  let imageUrl = currentProduct?.imageUrl;

  if (removeImage) {
    imageUrl = null;
  }

  if (imageFile && imageFile.size > 0) {
    const uploadDir = path.join(process.cwd(), 'public/uploads/tienda');
    await fs.mkdir(uploadDir, { recursive: true });
    const filename = `${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    await fs.writeFile(path.join(uploadDir, filename), buffer);
    imageUrl = `/uploads/tienda/${filename}`;
  }

  const product = await prisma.shopProduct.update({
    where: { id },
    data: {
      name,
      description,
      price,
      category,
      sizes,
      imageUrl,
    },
  });

  revalidatePath('/admin/tienda');
  revalidatePath('/tienda');
  return { success: true, product };
}

export async function toggleProductStatusAction(id: string, active: boolean) {
  await checkAuth();

  await prisma.shopProduct.update({
    where: { id },
    data: { active },
  });

  revalidatePath('/admin/tienda');
  revalidatePath('/tienda');
  return { success: true };
}

export async function deleteProductAction(id: string) {
  try {
    await checkAuth();

    // Check if the product has associated orders
    const ordersCount = await prisma.shopOrder.count({
      where: { productId: id },
    });

    if (ordersCount > 0) {
      return { 
        success: false, 
        error: 'No se puede eliminar el producto porque tiene pedidos asociados. Por favor, desactívalo usando el botón "Visible" en su lugar.' 
      };
    }

    await prisma.shopProduct.delete({
      where: { id },
    });

    revalidatePath('/admin/tienda');
    revalidatePath('/tienda');
    return { success: true };
  } catch (err: any) {
    console.error('Error in deleteProductAction:', err);
    return { success: false, error: 'Ocurrió un error al intentar eliminar el producto.' };
  }
}
