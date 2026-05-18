'use server';

import { prisma } from '@/lib/prisma';
import { getUserSession } from '@/lib/auth';

export async function getPriorityListsAction() {
  const session = await getUserSession();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'VOCAL')) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const lists = await prisma.priorityList.findMany({
      orderBy: { createdAt: 'desc' }
    });
    return { success: true, lists };
  } catch (error) {
    console.error('Error fetching priority lists:', error);
    return { success: false, error: 'Internal Server Error' };
  }
}

export async function savePriorityListAction(eventName: string, comments: string, members: any[]) {
  const session = await getUserSession();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'VOCAL')) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const newList = await prisma.priorityList.create({
      data: {
        eventName,
        comments,
        members // members is an array, Prisma will serialize it to JSON
      }
    });
    return { success: true, list: newList };
  } catch (error) {
    console.error('Error saving priority list:', error);
    return { success: false, error: 'Internal Server Error' };
  }
}

export async function deletePriorityListAction(id: string) {
  const session = await getUserSession();
  if (!session || (session.role !== 'ADMIN' && session.role !== 'VOCAL')) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    await prisma.priorityList.delete({
      where: { id }
    });
    return { success: true };
  } catch (error) {
    console.error('Error deleting priority list:', error);
    return { success: false, error: 'Internal Server Error' };
  }
}
