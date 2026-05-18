'use server';

import { getUserSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

export async function uploadProfileImageAction(formData: FormData) {
  const session = await getUserSession();
  if (!session) {
    return { error: 'No autorizado' };
  }

  const file = formData.get('image') as File | null;
  if (!file) {
    return { error: 'No se ha seleccionado ninguna imagen' };
  }

  if (!file.type.startsWith('image/')) {
    return { error: 'El archivo debe ser una imagen' };
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  
  // Usar el ID del usuario como nombre de archivo para evitar duplicados
  const extension = path.extname(file.name) || '.jpg';
  const filename = `user-${session.userId}-${Date.now()}${extension}`;
  
  const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'profiles');
  
  try {
    // Asegurarse de que el directorio existe
    await fs.mkdir(uploadDir, { recursive: true });
    
    // Guardar la imagen localmente
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);
    
    const imageUrl = `/uploads/profiles/${filename}`;
    
    // Actualizar la base de datos
    await prisma.user.update({
      where: { id: session.userId },
      data: { image: imageUrl },
    });

    revalidatePath('/perfil');
    revalidatePath('/'); // En caso de que se use en Navbar global
    return { success: true, imageUrl };
  } catch (error) {
    console.error('Error al guardar la imagen:', error);
    return { error: 'No se pudo guardar la imagen' };
  }
}
