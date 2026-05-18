'use server';

import { prisma } from '@/lib/prisma';
import { getUserSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

/**
 * Función central para otorgar (o quitar) puntos a un usuario y registrar la transacción.
 */
export async function addPointsToUser(userId: string, amount: number, reason: string) {
  try {
    // Usar transacción para asegurar la consistencia
    await prisma.$transaction(async (tx) => {
      // 1. Actualizar puntos del usuario
      await tx.user.update({
        where: { id: userId },
        data: {
          points: { increment: amount },
        },
      });

      // 2. Registrar la transacción
      await tx.pointTransaction.create({
        data: {
          userId,
          amount,
          reason,
        },
      });
    });

    return { success: true };
  } catch (error) {
    console.error(`Error adding points to user ${userId}:`, error);
    return { error: 'No se pudieron asignar los puntos' };
  }
}

/**
 * Acción de administrador para dar/quitar puntos manualmente
 */
export async function adminAdjustPointsAction(formData: FormData) {
  const session = await getUserSession();
  if (!session || session.role !== 'ADMIN') {
    return { error: 'No autorizado' };
  }

  const targetUserId = formData.get('userId') as string;
  const amountStr = formData.get('amount') as string;
  const reason = formData.get('reason') as string;

  if (!targetUserId || !amountStr || !reason) {
    return { error: 'Faltan campos obligatorios' };
  }

  const amount = parseInt(amountStr, 10);
  if (isNaN(amount) || amount === 0) {
    return { error: 'Cantidad inválida' };
  }

  const res = await addPointsToUser(targetUserId, amount, reason);
  if (res.error) return res;

  revalidatePath('/admin/users');
  return { success: true };
}
