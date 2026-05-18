'use server';

import { prisma } from '@/lib/prisma';
import { getUserSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { addPointsToUser } from './points';

export async function createEventAction(formData: FormData) {
  const session = await getUserSession();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'VOCAL')) throw new Error('No autorizado');

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const dateStr = formData.get('date') as string;
  const endDateStr = formData.get('endDate') as string;
  const type = formData.get('type') as 'ASSOCIATION' | 'HOLIDAY' | 'EXAM' | 'WORKSHOP' | 'OTHER';
  const color = formData.get('color') as string;
  const location = formData.get('location') as string;
  const isOpenEvent = formData.get('isOpenEvent') === 'true';
  const priceStr = formData.get('price') as string;
  const price = priceStr && !isOpenEvent ? parseFloat(priceStr.replace(',', '.')) : 0;
  const isPaid = price > 0;
  const registrationDeadlineStr = formData.get('registrationDeadline') as string;
  const pointsRewardStr = formData.get('pointsReward') as string;
  const pointsReward = pointsRewardStr ? parseInt(pointsRewardStr, 10) : 20;

  if (!title || !dateStr) return;

  await prisma.event.create({
    data: {
      title,
      description: description || null,
      date: new Date(dateStr),
      endDate: endDateStr ? new Date(endDateStr) : null,
      registrationDeadline: registrationDeadlineStr ? new Date(registrationDeadlineStr) : null,
      type: type || 'ASSOCIATION',
      color: color || 'bg-purple-500',
      location: location || null,
      fee: isOpenEvent ? 'Abierto / Continuo' : (isPaid ? `${price.toFixed(2)}€` : 'Gratis'),
      price: isPaid ? price : null,
      isOpenEvent,
      pointsReward,
      authorId: session.userId,
    }
  });

  revalidatePath('/admin/events');
  revalidatePath('/calendario');
  revalidatePath('/perfil');
}

export async function deleteEventAction(eventId: string) {
  const session = await getUserSession();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'VOCAL')) throw new Error('No autorizado');

  await prisma.event.delete({ where: { id: eventId } });
  revalidatePath('/admin/events');
  revalidatePath('/calendario');
  revalidatePath('/perfil');
  revalidatePath('/');
}

export async function toggleRSVPAction(eventId: string, paymentMethod?: string) {
  const session = await getUserSession();
  if (!session) throw new Error('No autorizado');

  // Block unverified users from RSVPing
  const currentUser = await prisma.user.findUnique({ where: { id: session.userId }, select: { emailVerified: true, role: true } });
  if (!currentUser?.emailVerified) {
    return { error: 'Debes verificar tu email antes de apuntarte a eventos.' };
  }
  if (currentUser.role === 'GUEST') {
    return { error: 'Tu cuenta debe ser aceptada por la Junta para poder apuntarte a eventos.' };
  }

  const event = await prisma.event.findUnique({ where: { id: eventId } });
  
  // Check registration deadline
  if (event && event.registrationDeadline && new Date() > event.registrationDeadline) {
    return { error: 'El plazo de inscripción para este evento ha finalizado.' };
  }

  const existing = await prisma.attendance.findUnique({
    where: {
      eventId_userId: { eventId, userId: session.userId }
    }
  });

  if (existing) {
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    const isPaidEvent = event && event.price && event.price > 0;

    // Si ya ha pagado, no permitimos desapuntarse automáticamente (por seguridad contable)
    if (isPaidEvent && existing.paymentStatus === 'PAID') {
      return; 
    }

    // Si está intentando cambiar a efectivo tras un intento fallido/pendiente de tarjeta
    if (isPaidEvent && paymentMethod === 'CASH' && existing.paymentStatus === 'PENDING') {
      await prisma.attendance.update({
        where: { id: existing.id },
        data: { paymentMethod: 'CASH', paymentStatus: 'PENDING', checkoutReference: null }
      });
    } else {
      // Si es un evento gratuito o una asistencia pendiente no confirmada, permitimos borrar
      await prisma.attendance.delete({
        where: { id: existing.id }
      });
      // Restar puntos si se desapunta
      if (!isPaidEvent || existing.paymentStatus === 'PAID') {
        if (event && event.pointsReward > 0) {
          await addPointsToUser(session.userId, -event.pointsReward, `Cancelada asistencia: ${event.title}`);
        }
      }
    }
  } else {
    // Si no existe, lo creamos. Si hay un paymentMethod y el evento cuesta dinero, lo ponemos como PENDING
    const event = await prisma.event.findUnique({ where: { id: eventId } });
    const isPaid = event && event.price && event.price > 0;
    const paymentStatus = isPaid && paymentMethod === 'CASH' ? 'PENDING' : (isPaid ? 'PENDING' : 'PAID');

    await prisma.attendance.create({
      data: { 
        eventId, 
        userId: session.userId,
        paymentMethod: isPaid && paymentMethod ? paymentMethod : null,
        paymentStatus,
      }
    });

    // Otorgar puntos inmediatamente si es gratuito (PAID implicito)
    if (event && event.pointsReward > 0 && paymentStatus === 'PAID') {
      await addPointsToUser(session.userId, event.pointsReward, `Asistencia confirmada: ${event.title}`);
    }
  }

  revalidatePath('/calendario');
  revalidatePath('/perfil');
  revalidatePath('/');
}

export async function getEventDetailsAction(eventId: string) {
  const session = await getUserSession();
  
  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      attendances: {
        include: {
          user: {
            select: { name: true, email: true, image: true, role: true }
          }
        }
      }
    }
  });

  if (!event) return null;

  if (!session) {
    return { ...event, attendances: [], userAttendance: null };
  }

  const userAttendance = await prisma.attendance.findUnique({
    where: { eventId_userId: { eventId: eventId, userId: session.userId } }
  });

  return { ...event, userAttendance };
}

export async function updateEventAction(eventId: string, formData: FormData) {
  const session = await getUserSession();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'VOCAL')) throw new Error('No autorizado');

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const dateStr = formData.get('date') as string;
  const endDateStr = formData.get('endDate') as string;
  const type = formData.get('type') as 'ASSOCIATION' | 'HOLIDAY' | 'EXAM' | 'WORKSHOP' | 'OTHER';
  const color = formData.get('color') as string;
  const location = formData.get('location') as string;
  const isOpenEvent = formData.get('isOpenEvent') === 'true';
  const priceStr = formData.get('price') as string;
  const price = priceStr && !isOpenEvent ? parseFloat(priceStr.replace(',', '.')) : 0;
  const isPaid = price > 0;
  const registrationDeadlineStr = formData.get('registrationDeadline') as string;
  const pointsRewardStr = formData.get('pointsReward') as string;
  const pointsReward = pointsRewardStr ? parseInt(pointsRewardStr, 10) : 20;

  if (!title || !dateStr) return;

  await prisma.event.update({
    where: { id: eventId },
    data: {
      title,
      description: description || null,
      date: new Date(dateStr),
      endDate: endDateStr ? new Date(endDateStr) : null,
      registrationDeadline: registrationDeadlineStr ? new Date(registrationDeadlineStr) : null,
      type: type || 'ASSOCIATION',
      color: color || 'bg-purple-500',
      location: location || null,
      fee: isOpenEvent ? 'Abierto / Continuo' : (isPaid ? `${price.toFixed(2)}€` : 'Gratis'),
      price: isPaid ? price : null,
      isOpenEvent,
      pointsReward,
    }
  });

  revalidatePath('/admin/events');
  revalidatePath('/perfil');
  revalidatePath('/calendario');
  revalidatePath('/');
}

export async function removeAttendeeAction(eventId: string, userId: string) {
  const session = await getUserSession();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'VOCAL')) throw new Error('No autorizado');

  const attendance = await prisma.attendance.findUnique({
    where: { eventId_userId: { eventId, userId } },
    include: { event: true }
  });

  if (!attendance) return;

  await prisma.attendance.delete({
    where: { eventId_userId: { eventId, userId } }
  });

  if (attendance.event.pointsReward > 0 && attendance.paymentStatus === 'PAID') {
    await addPointsToUser(userId, -attendance.event.pointsReward, `Eliminado de evento: ${attendance.event.title}`);
  }

  revalidatePath('/admin/events');
  revalidatePath('/perfil');
}

export async function confirmCashPaymentAction(eventId: string, userId: string) {
  const session = await getUserSession();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'VOCAL')) throw new Error('No autorizado');

  const attendance = await prisma.attendance.findUnique({
    where: { eventId_userId: { eventId, userId } }
  });

  if (attendance && attendance.paymentMethod === 'CASH') {
    const updated = await prisma.attendance.update({
      where: { id: attendance.id },
      data: { paymentStatus: 'PAID' },
      include: { event: true }
    });

    if (updated.event.pointsReward > 0) {
      await addPointsToUser(userId, updated.event.pointsReward, `Pago en efectivo confirmado: ${updated.event.title}`);
    }
  }

  revalidatePath('/admin/events');
  revalidatePath('/perfil');
}

export async function getEventSummaryDataAction(eventId: string) {
  const session = await getUserSession();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'VOCAL')) {
    throw new Error('No autorizado');
  }

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      attendances: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
              dietary: true,
              allergies: true,
              alcohol: true,
              tShirtSize: true,
              hasCar: true,
            }
          }
        }
      }
    }
  });

  return event;
}
