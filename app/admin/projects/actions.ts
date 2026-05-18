'use server';

import { prisma } from '@/lib/prisma';
import { getUserSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import fs from 'fs/promises';
import path from 'path';

export async function createProjectAction(formData: FormData) {
  const session = await getUserSession();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'VOCAL')) {
    throw new Error('No autorizado');
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const vocaliaId = formData.get('vocaliaId') as string;
  const duration = formData.get('duration') as string;
  
  // En Multiselect, los valores vienen como una lista de campos repetidos
  const memberIds = formData.getAll('members') as string[];

  // Archivos
  const pdfFile = formData.get('pdfFile') as File | null;
  const imageFile = formData.get('imageFile') as File | null;

  let pdfUrl = null;
  let imageUrl = null;

  const uploadDir = path.join(process.cwd(), 'public/uploads/projects');
  await fs.mkdir(uploadDir, { recursive: true });

  if (pdfFile && pdfFile.size > 0) {
    const filename = `${Date.now()}-${pdfFile.name.replace(/\s+/g, '-')}`;
    const buffer = Buffer.from(await pdfFile.arrayBuffer());
    await fs.writeFile(path.join(uploadDir, filename), buffer);
    pdfUrl = `/uploads/projects/${filename}`;
  }

  if (imageFile && imageFile.size > 0) {
    const filename = `${Date.now()}-${imageFile.name.replace(/\s+/g, '-')}`;
    const buffer = Buffer.from(await imageFile.arrayBuffer());
    await fs.writeFile(path.join(uploadDir, filename), buffer);
    imageUrl = `/uploads/projects/${filename}`;
  }

  const newProject = await prisma.project.create({
    data: {
      title,
      description,
      vocaliaId,
      duration,
      pdfUrl,
      imageUrl,
      members: {
        connect: memberIds.map(id => ({ id }))
      }
    }
  });

  revalidatePath('/admin/projects');
  revalidatePath('/proyectos');

  return { success: true, project: newProject };
}
