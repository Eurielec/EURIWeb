'use server';

import { prisma } from '@/lib/prisma';

export async function getActiveProducts() {
  return await prisma.shopProduct.findMany({
    where: { active: true },
    include: { variants: true },
    orderBy: { createdAt: 'asc' },
  });
}

export async function getShopSettings() {
  const settings = await prisma.shopSetting.findMany();
  return settings.reduce((acc: Record<string, string>, s) => ({ ...acc, [s.key]: s.value }), {});
}
