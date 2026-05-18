'use server';

import { prisma } from '@/lib/prisma';
import { getUserSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function saveIMWPricesAction(prices: { userId: string; calculatedPrice: number }[]) {
  const session = await getUserSession();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'VOCAL')) throw new Error('No autorizado');

  // We can do this in a transaction or individually. Since it might be many users,
  // let's do a transaction or a loop.
  for (const item of prices) {
    await prisma.user.update({
      where: { id: item.userId },
      data: {
        imwPrice: item.calculatedPrice,
        imwPaymentStatus: 'PENDING'
      }
    });
  }

  revalidatePath('/admin/ranking');
  revalidatePath('/perfil');
  
  return { success: true };
}

export async function deactivateIMWPricesAction() {
  const session = await getUserSession();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'VOCAL')) throw new Error('No autorizado');

  await prisma.user.updateMany({
    where: { imwPrice: { not: null } },
    data: {
      imwPrice: null,
      imwPaymentStatus: null
    }
  });

  revalidatePath('/admin/ranking');
  revalidatePath('/perfil');
  
  return { success: true };
}

export async function createIMWCheckoutAction() {
  const session = await getUserSession();
  if (!session) return { success: false, error: 'No autorizado' };

  const user = await prisma.user.findUnique({
    where: { id: session.userId }
  });

  if (!user || user.imwPrice === null) {
    return { success: false, error: 'No tienes un precio IMW asignado' };
  }

  if (user.imwPaymentStatus === 'PAID') {
    return { success: false, error: 'El IMW ya ha sido pagado' };
  }

  const apiKey = process.env.SUMUP_API_KEY;
  const merchantCode = process.env.SUMUP_MERCHANT_CODE;

  if (!apiKey || !merchantCode) {
    return { success: false, error: 'Configuración de pago no disponible' };
  }

  const reference = `IMW-${user.id}-${Date.now()}`;
  const description = `Pago IMW - ${user.name || user.email}`;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

  try {
    const response = await fetch('https://api.sumup.com/v0.1/checkouts', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        checkout_reference: reference,
        amount: user.imwPrice,
        currency: 'EUR',
        merchant_code: merchantCode,
        description,
        redirect_url: `${baseUrl}/perfil?payment=success&ref=${reference}`,
      }),
    });

    if (!response.ok) {
      return { success: false, error: `Error al crear el pago (${response.status})` };
    }

    const data = await response.json();

    return { success: true, checkoutId: data.id };
  } catch (error) {
    console.error('Error in createIMWCheckoutAction:', error);
    return { success: false, error: 'Error interno de comunicación' };
  }
}

export async function confirmIMWPaymentAction() {
  const session = await getUserSession();
  if (!session) return { success: false, error: 'No autorizado' };

  await prisma.user.update({
    where: { id: session.userId },
    data: {
      imwPaymentStatus: 'PAID_CARD'
    }
  });

  revalidatePath('/perfil');
  return { success: true };
}

export async function updateIMWPaymentStatusAction(userId: string, status: string) {
  const session = await getUserSession();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'VOCAL')) throw new Error('No autorizado');

  await prisma.user.update({
    where: { id: userId },
    data: { imwPaymentStatus: status }
  });

  revalidatePath('/admin/ranking');
  revalidatePath('/perfil');
  
  return { success: true };
}

export async function declareCashPaymentIMWAction() {
  const session = await getUserSession();
  if (!session) return { success: false, error: 'No autorizado' };

  await prisma.user.update({
    where: { id: session.userId },
    data: { imwPaymentStatus: 'PENDING_CASH' }
  });

  revalidatePath('/admin/ranking');
  revalidatePath('/perfil');
  return { success: true };
}
