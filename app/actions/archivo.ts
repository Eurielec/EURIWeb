'use server';

import { prisma } from '@/lib/prisma';
import { getUserSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getDocuments() {
  const p = prisma as any;
  if (!p.document) {
    console.error('Prisma Error: model "document" not found in client');
    return [];
  }
  return await p.document.findMany({
    orderBy: { createdAt: 'desc' }
  });
}

import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function createDocumentAction(formData: FormData) {
  const session = await getUserSession();
  if (!session || session.role !== 'ADMIN') {
    return { error: 'No autorizado.' };
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const manualFileUrl = formData.get('fileUrl') as string;
  const file = formData.get('file') as File | null;

  let finalFileUrl = manualFileUrl;

  // Si se ha subido un archivo, lo guardamos localmente
  if (file && file.size > 0) {
    try {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);

      // Limpiar nombre de archivo para evitar problemas
      const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, '_');
      const fileName = `${Date.now()}-${sanitizedFileName}`;
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'archivo');
      
      // Asegurar que el directorio existe
      await mkdir(uploadDir, { recursive: true });
      
      const filePath = path.join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      
      finalFileUrl = `/uploads/archivo/${fileName}`;
    } catch (err) {
       console.error('Error al subir archivo:', err);
       return { error: 'Error al procesar la subida del archivo.' };
    }
  }

  if (!title || !finalFileUrl || !category) {
    return { error: 'Título, archivo (o URL) y categoría son obligatorios.' };
  }

  try {
    const p = prisma as any;
    await p.document.create({
      data: {
        title,
        description: description || null,
        fileUrl: finalFileUrl,
        category
      }
    });

    revalidatePath('/admin/archivo');
    revalidatePath('/archivo');
    return { success: true };
  } catch (error) {
    console.error('Error al crear documento:', error);
    return { error: 'Error al guardar el documento en la base de datos.' };
  }
}

export async function deleteDocumentAction(id: string) {
  const session = await getUserSession();
  if (!session || session.role !== 'ADMIN') {
    return { error: 'No autorizado.' };
  }

  try {
    const p = prisma as any;
    await p.document.delete({
      where: { id }
    });

    revalidatePath('/admin/archivo');
    revalidatePath('/archivo');
    return { success: true };
  } catch (error) {
    return { error: 'Error al eliminar el documento.' };
  }
}
