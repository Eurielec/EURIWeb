'use server';

import { prisma } from '@/lib/prisma';
import { getUserSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

/**
 * Obtener todos los miembros de la junta ordenados
 */
export async function getJuntaMembersAction() {
  return await prisma.juntaMember.findMany({
    orderBy: { order: 'asc' }
  });
}

/**
 * Crear un nuevo miembro de la junta
 */
export async function createJuntaMemberAction(data: {
  name: string;
  role: string;
  description: string;
  imageUrl?: string;
  order?: number;
}) {
  const session = await getUserSession();
  if (!session || session.role !== 'ADMIN') throw new Error('No autorizado');

  const member = await prisma.juntaMember.create({
    data: {
      name: data.name,
      role: data.role,
      description: data.description,
      imageUrl: data.imageUrl || null,
      order: data.order ?? 0,
    }
  });

  revalidatePath('/admin/junta');
  revalidatePath('/junta');
  return member;
}

/**
 * Actualizar un miembro existente
 */
export async function updateJuntaMemberAction(id: string, data: {
  name: string;
  role: string;
  description: string;
  imageUrl?: string;
  order?: number;
}) {
  const session = await getUserSession();
  if (!session || session.role !== 'ADMIN') throw new Error('No autorizado');

  const member = await prisma.juntaMember.update({
    where: { id },
    data: {
      name: data.name,
      role: data.role,
      description: data.description,
      imageUrl: data.imageUrl,
      order: data.order,
    }
  });

  revalidatePath('/admin/junta');
  revalidatePath('/junta');
  return member;
}

/**
 * Eliminar un miembro de la junta
 */
export async function deleteJuntaMemberAction(id: string) {
  const session = await getUserSession();
  if (!session || session.role !== 'ADMIN') throw new Error('No autorizado');

  // Opcional: Eliminar la imagen del disco si existe
  const member = await prisma.juntaMember.findUnique({ where: { id } });
  if (member?.imageUrl && member.imageUrl.startsWith('/uploads/junta/')) {
    try {
      const filePath = path.join(process.cwd(), 'public', member.imageUrl);
      await fs.unlink(filePath);
    } catch (e) {
      console.error('No se pudo eliminar la imagen del disco:', e);
    }
  }

  await prisma.juntaMember.delete({ where: { id } });

  revalidatePath('/admin/junta');
  revalidatePath('/junta');
}

/**
 * Subir una imagen para un miembro de la junta
 */
export async function uploadJuntaImageAction(formData: FormData) {
  const session = await getUserSession();
  if (!session || session.role !== 'ADMIN') {
    return { error: 'No autorizado' };
  }

  const file = formData.get('image') as File | null;
  if (!file) {
    return { error: 'No se ha seleccionado ninguna imagen' };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const extension = path.extname(file.name) || '.png';
  const filename = `junta-${Date.now()}${extension}`;
  
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'junta');
  
  try {
    await fs.mkdir(uploadDir, { recursive: true });
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);
    
    const imageUrl = `/uploads/junta/${filename}`;
    return { success: true, imageUrl };
  } catch (error) {
    console.error('Error al guardar la imagen:', error);
    return { error: 'No se pudo guardar la imagen' };
  }
}

/**
 * Reordenar miembros de la junta
 */
export async function reorderJuntaMembersAction(memberIds: string[]) {
  const session = await getUserSession();
  if (!session || session.role !== 'ADMIN') throw new Error('No autorizado');

  const updates = memberIds.map((id, index) => 
    prisma.juntaMember.update({
      where: { id },
      data: { order: index }
    })
  );

  await prisma.$transaction(updates);

  revalidatePath('/admin/junta');
  revalidatePath('/junta');
}
