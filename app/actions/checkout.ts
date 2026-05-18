'use server';

import { prisma } from '@/lib/prisma';
import { getUserSession } from '@/lib/auth';

/**
 * Server Action para crear checkouts de SumUp.
 * Ahora usa la base de datos para obtener precios y registrar pedidos.
 */

export async function getProductPrice(productId: string): Promise<number | null> {
  const product = await prisma.shopProduct.findUnique({
    where: { id: productId }
  });
  return product?.price ?? null;
}

interface CheckoutResult {
  success: boolean;
  checkoutId?: string;
  reference?: string;
  error?: string;
}

export async function createSumUpCheckout(
  productId: string,
  size?: string,
  color?: string
): Promise<CheckoutResult> {
  // 1. Obtener producto y variante de la BD
  const product = await prisma.shopProduct.findUnique({
    where: { id: productId },
    include: { variants: true }
  });

  if (!product) {
    return { success: false, error: 'Producto no encontrado' };
  }

  // Buscar la variante específica si hay talla/color
  let variantId: string | undefined;
  if (size || color) {
    const v = product.variants.find(v => 
      (size ? v.size === size : true) && 
      (color ? v.color === color : true)
    );
    if (!v) return { success: false, error: 'Combinación no disponible' };
    if (v.stock <= 0) return { success: false, error: 'Sin stock disponible' };
    variantId = v.id;
  } else if (product.variants.length > 0) {
    // Si el producto tiene variantes pero no se seleccionó ninguna (ej: producto simple con stock)
    variantId = product.variants[0].id;
  }

  const apiKey = process.env.SUMUP_API_KEY;
  const merchantCode = process.env.SUMUP_MERCHANT_CODE;

  if (!apiKey || !merchantCode) {
    return { success: false, error: 'Configuración de pago no disponible' };
  }

  // Referencia única para este pedido
  const reference = `EUR-${productId}-${size || 'U'}-${color || 'U'}-${Date.now()}`;
  const description = `${product.name}${size ? ` - Talla ${size}` : ''}${color ? ` - Color ${color}` : ''}`;

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
        amount: product.price,
        currency: 'EUR',
        merchant_code: merchantCode,
        description,
        redirect_url: `${baseUrl}/tienda?payment=success&ref=${reference}`,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('SumUp API error:', response.status, errorData);
      return { success: false, error: `Error al crear el pago (${response.status})` };
    }

    const data = await response.json();

    // 2. Registrar el pedido en la base de datos como PENDING
    await prisma.shopOrder.create({
      data: {
        productId: product.id,
        variantId: variantId || null,
        size: size || null,
        amount: product.price,
        checkoutId: data.id,
        checkoutReference: reference,
        status: 'PENDING',
      }
    });

    return { success: true, checkoutId: data.id };
  } catch (err) {
    console.error('SumUp checkout creation failed:', err);
    return { success: false, error: 'Error de conexión con el servicio de pago' };
  }
}

/**
 * Nota: En un sistema real, usaríamos webhooks de SumUp para actualizar a "PAID".
 * Por ahora, al volver con ?payment=success, podríamos llamar a una acción 
 * para verificar el estado y actualizarlo.
 */
export async function verifyAndCompleteOrder(reference: string) {
  const order = await prisma.shopOrder.findFirst({
    where: { checkoutReference: reference },
    include: { variant: true }
  });

  if (order && order.status === 'PENDING') {
    // 1. Actualizar estado del pedido
    await prisma.shopOrder.update({
      where: { id: order.id },
      data: { status: 'PAID' }
    });

    // 2. Restar stock de la variante si existe
    if (order.variantId && order.variant) {
      await prisma.shopVariant.update({
        where: { id: order.variantId },
        data: { stock: { decrement: 1 } }
      });
    }

    return true;
  }
  return false;
}

export async function createEventSumUpCheckout(eventId: string): Promise<CheckoutResult> {
  const session = await getUserSession();
  if (!session) return { success: false, error: 'No autorizado' };

  const event = await prisma.event.findUnique({
    where: { id: eventId }
  });

  if (!event || !event.price || event.price <= 0) {
    return { success: false, error: 'Evento no válido o sin precio' };
  }

  const apiKey = process.env.SUMUP_API_KEY;
  const merchantCode = process.env.SUMUP_MERCHANT_CODE;

  if (!apiKey || !merchantCode) {
    return { success: false, error: 'Configuración de pago no disponible' };
  }

  const reference = `EVT-${eventId}-${session.userId}-${Date.now()}`;
  const description = `Inscripción: ${event.title}`;
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
        amount: event.price,
        currency: 'EUR',
        merchant_code: merchantCode,
        description,
        redirect_url: `${baseUrl}/calendario?payment=success&ref=${reference}`,
      }),
    });

    if (!response.ok) {
      console.error('SumUp API error:', await response.text());
      return { success: false, error: 'Error al crear el pago' };
    }

    const data = await response.json();

    // Crear la asistencia como PENDING
    const existing = await prisma.attendance.findUnique({
      where: { eventId_userId: { eventId, userId: session.userId } }
    });

    if (existing) {
      await prisma.attendance.update({
        where: { id: existing.id },
        data: { paymentMethod: 'CARD', paymentStatus: 'PENDING', checkoutReference: reference }
      });
    } else {
      await prisma.attendance.create({
        data: {
          eventId,
          userId: session.userId,
          paymentMethod: 'CARD',
          paymentStatus: 'PENDING',
          checkoutReference: reference,
        }
      });
    }

    return { success: true, checkoutId: data.id, reference };
  } catch (err) {
    console.error('SumUp checkout creation failed:', err);
    return { success: false, error: 'Error de conexión con el servicio de pago' };
  }
}

import { addPointsToUser } from './points';

export async function verifyEventPayment(reference: string) {
  const attendance = await prisma.attendance.findFirst({
    where: { checkoutReference: reference },
    include: { event: true }
  });

  if (attendance && attendance.paymentStatus === 'PENDING') {
    await prisma.attendance.update({
      where: { id: attendance.id },
      data: { paymentStatus: 'PAID' }
    });

    if (attendance.event.pointsReward > 0) {
      await addPointsToUser(attendance.userId, attendance.event.pointsReward, `Pago online confirmado de evento: ${attendance.event.title}`);
    }
    return true;
  }
  return false;
}

