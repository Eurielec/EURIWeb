'use server';

import { prisma } from '@/lib/prisma';
import { getUserSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function createMembershipCheckoutAction() {
  const session = await getUserSession();
  if (!session) return { success: false, error: 'No autorizado' };

  const user = await prisma.user.findUnique({
    where: { id: session.userId }
  });

  if (!user || user.membershipPrice === null) {
    return { success: false, error: 'No tienes una cuota asignada' };
  }

  if (user.membershipPaymentStatus === 'PAID' || user.membershipPaymentStatus === 'PAID_CARD' || user.membershipPaymentStatus === 'PAID_CASH') {
    return { success: false, error: 'La cuota ya ha sido pagada' };
  }

  const apiKey = process.env.SUMUP_API_KEY;
  const merchantCode = process.env.SUMUP_MERCHANT_CODE;

  if (!apiKey || !merchantCode) {
    return { success: false, error: 'Configuración de pago no disponible' };
  }

  const reference = `MEMB-${user.id}-${Date.now()}`;
  const description = `Cuota de Socio - ${user.name || user.email}`;
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
        amount: user.membershipPrice,
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
    
    await prisma.user.update({
      where: { id: user.id },
      data: { membershipCheckoutRef: reference }
    });

    return { success: true, checkoutId: data.id };
  } catch (error) {
    console.error('Error in createMembershipCheckoutAction:', error);
    return { success: false, error: 'Error interno de comunicación' };
  }
}

export async function confirmMembershipPaymentAction() {
  const session = await getUserSession();
  if (!session) return { success: false, error: 'No autorizado' };

  await prisma.user.update({
    where: { id: session.userId },
    data: {
      membershipPaymentStatus: 'PAID_CARD'
    }
  });

  revalidatePath('/perfil');
  revalidatePath('/completar-perfil');
  return { success: true };
}

export async function declareCashPaymentMembershipAction() {
  const session = await getUserSession();
  if (!session) return { success: false, error: 'No autorizado' };

  await prisma.user.update({
    where: { id: session.userId },
    data: { membershipPaymentStatus: 'PENDING_CASH' }
  });

  revalidatePath('/perfil');
  revalidatePath('/completar-perfil');
  return { success: true };
}

export async function resetAllMembershipPaymentsAction() {
  try {
    const session = await getUserSession();
    if (!session || session.role !== 'ADMIN') {
      return { success: false, error: 'No autorizado' };
    }

    await prisma.user.updateMany({
      where: { 
        role: { not: 'GUEST' } 
      },
      data: {
        membershipPaymentStatus: 'PENDING',
        membershipPrice: 10.0,
        membershipCheckoutRef: null
      }
    });

    revalidatePath('/admin/users');
    revalidatePath('/perfil');
    
    return { success: true };
  } catch (error: any) {
    console.error('Error in resetAllMembershipPaymentsAction:', error);
    return { success: false, error: error.message };
  }
}

export async function confirmCashMembershipByAdminAction(userId: string) {
  try {
    const session = await getUserSession();
    if (!session || (session.role !== 'ADMIN' && session.role !== 'VOCAL')) {
      return { success: false, error: 'No autorizado' };
    }

    await prisma.user.update({
      where: { id: userId },
      data: { membershipPaymentStatus: 'PAID_CASH' }
    });

    revalidatePath('/admin/users');
    revalidatePath('/perfil');

    return { success: true };
  } catch (error: any) {
    console.error('Error in confirmCashMembershipByAdminAction:', error);
    return { success: false, error: error.message };
  }
}
