'use server';

import { prisma } from '@/lib/prisma';
import { getUserSession } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function updatePreferencesAction(prevState: unknown, formData: FormData) {
  const session = await getUserSession();
  if (!session) redirect('/login');

  const dietary = formData.get('dietary') as string;
  const allergies = formData.get('allergies') as string;
  const alcohol = formData.get('alcohol') as string;
  const tShirtSize = formData.get('tShirtSize') as string;
  const hasCar = formData.get('hasCar') === 'true';

  if (!dietary || !alcohol || !tShirtSize) {
    return { error: 'Por favor, rellena los campos obligatorios.' };
  }

  await prisma.user.update({
    where: { id: session.userId },
    data: {
      dietary,
      allergies,
      alcohol,
      tShirtSize,
      hasCar,
    },
  });

  if (session.role === 'ADMIN') {
    redirect('/admin');
  } else {
    redirect('/perfil');
  }
}
