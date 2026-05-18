'use server';

import { prisma } from '@/lib/prisma';
import { getUserSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { ScrutinyType, VoteChoice } from '@prisma/client';
import { addPointsToUser } from './points';

export async function createPollAction(formData: FormData) {
  const session = await getUserSession();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'VOCAL')) {
    return { error: 'No autorizado' };
  }

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const scrutinyTypeStr = formData.get('scrutinyType') as string;

  if (!title) return { error: 'El título es obligatorio' };

  let scrutinyType = ScrutinyType.SIMPLE;
  if (scrutinyTypeStr === 'ABSOLUTE') scrutinyType = ScrutinyType.ABSOLUTE;
  if (scrutinyTypeStr === 'TWO_THIRDS') scrutinyType = ScrutinyType.TWO_THIRDS;

  try {
    const poll = await prisma.poll.create({
      data: {
        title,
        description,
        type: scrutinyType,
        isActive: true,
      },
    });

    revalidatePath('/admin/votaciones');
    revalidatePath('/perfil/votaciones');
    return { success: true, pollId: poll.id };
  } catch (error) {
    console.error('Error creating poll:', error);
    return { error: 'Error interno al crear la votación' };
  }
}

export async function closePollAction(pollId: string) {
  const session = await getUserSession();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'VOCAL')) {
    return { error: 'No autorizado' };
  }

  try {
    // 1. Cerrar la votación
    const poll = await prisma.poll.update({
      where: { id: pollId },
      data: { isActive: false },
    });

    // 2. Obtener los asistentes y los votos emitidos
    const attendees = await prisma.pollAttendee.findMany({
      where: { pollId },
    });

    const votes = await prisma.vote.findMany({
      where: { pollId },
    });

    // 3. Asignar voto en BLANCO a los asistentes que no votaron
    const votersIds = votes.map(v => v.userId);
    const nonVoters = attendees.filter(a => !votersIds.includes(a.userId));

    if (nonVoters.length > 0) {
      await prisma.vote.createMany({
        data: nonVoters.map(nv => ({
          pollId: pollId,
          userId: nv.userId,
          choice: VoteChoice.BLANCO,
        })),
        skipDuplicates: true,
      });
    }

    revalidatePath('/admin/votaciones');
    revalidatePath('/perfil/votaciones');
    return { success: true };
  } catch (error) {
    console.error('Error closing poll:', error);
    return { error: 'Error al cerrar la votación' };
  }
}

export async function joinPollAction(pollId: string) {
  const session = await getUserSession();
  if (!session || !['USER', 'VOCAL', 'ADMIN'].includes(session.role)) {
    return { error: 'No tienes permisos para participar en votaciones' };
  }

  try {
    const poll = await prisma.poll.findUnique({ where: { id: pollId } });
    if (!poll || !poll.isActive) {
      return { error: 'Votación no encontrada o ya está cerrada' };
    }

    await prisma.pollAttendee.create({
      data: {
        pollId,
        userId: session.userId,
      },
    });

    revalidatePath('/perfil/votaciones');
    return { success: true };
  } catch (error: any) {
    if (error.code === 'P2002') {
      return { success: true }; // Ya estaba unido
    }
    console.error('Error joining poll:', error);
    return { error: 'Error al activar el modo votación' };
  }
}

export async function voteAction(pollId: string, choiceStr: string) {
  const session = await getUserSession();
  if (!session || !['USER', 'VOCAL', 'ADMIN'].includes(session.role)) {
    return { error: 'No tienes permisos para votar' };
  }

  const allowedChoices = ['FAVOR', 'CONTRA', 'ABSTENCION', 'BLANCO'];
  if (!allowedChoices.includes(choiceStr)) {
    return { error: 'Voto no válido' };
  }

  try {
    const poll = await prisma.poll.findUnique({ where: { id: pollId } });
    if (!poll || !poll.isActive) {
      return { error: 'La votación está cerrada o no existe' };
    }

    // Verificar que está en modo votación (attendee)
    const attendee = await prisma.pollAttendee.findUnique({
      where: {
        pollId_userId: { pollId, userId: session.userId },
      },
    });

    if (!attendee) {
      return { error: 'Debes activar el modo votación antes de votar' };
    }

    const existingVote = await prisma.vote.findUnique({
      where: { pollId_userId: { pollId, userId: session.userId } }
    });

    // Usar upsert por si el usuario cambia de voto antes de cerrar
    await prisma.vote.upsert({
      where: {
        pollId_userId: { pollId, userId: session.userId },
      },
      update: {
        choice: choiceStr as VoteChoice,
      },
      create: {
        pollId,
        userId: session.userId,
        choice: choiceStr as VoteChoice,
      },
    });

    // Si es la primera vez que vota en esta asamblea, darle 15 puntos
    if (!existingVote) {
      await addPointsToUser(session.userId, 15, `Participación en asamblea: ${poll.title}`);
    }

    revalidatePath('/perfil/votaciones');
    return { success: true };
  } catch (error) {
    console.error('Error voting:', error);
    return { error: 'Error al emitir el voto' };
  }
}

export async function deletePollAction(pollId: string) {
  const session = await getUserSession();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'VOCAL')) {
    return { error: 'No autorizado' };
  }

  try {
    await prisma.poll.delete({
      where: { id: pollId },
    });
    revalidatePath('/admin/votaciones');
    return { success: true };
  } catch (error) {
    console.error('Error deleting poll:', error);
    return { error: 'Error al eliminar' };
  }
}
