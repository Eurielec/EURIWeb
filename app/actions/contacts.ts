'use server';

import { prisma } from '@/lib/prisma';

export interface ContactPersonData {
  name: string;
  role: string;
  email: string;
  phone: string | null;
  img: string | null;
}

/**
 * Busca en la base de datos a las personas responsables de contacto.
 * - Secretario: ADMIN con vocalia = 'secretario'
 * - Vocal de CR: VOCAL con vocalia = 'cr'
 * - CP (Contact Person): ADMIN con vocalia = 'cp'
 */
export async function getContactPersons(): Promise<{
  secretario: ContactPersonData | null;
  cr: ContactPersonData | null;
  cp: ContactPersonData | null;
}> {
  const [secretario, cr, cp] = await Promise.all([
    // Secretario de la Junta
    prisma.user.findFirst({
      where: { vocalia: 'secretario' },
      select: { name: true, email: true, phone: true, image: true },
    }),
    // Vocal de Corporate Relations
    prisma.user.findFirst({
      where: { vocalia: 'cr' },
      select: { name: true, email: true, phone: true, image: true },
    }),
    // Contact Person (EESTEC)
    prisma.user.findFirst({
      where: { vocalia: 'cp' },
      select: { name: true, email: true, phone: true, image: true },
    }),
  ]);

  return {
    secretario: secretario
      ? { name: secretario.name || 'Secretario/a', role: 'Secretario/a — Junta Directiva', email: secretario.email, phone: secretario.phone, img: secretario.image || '/junta/member3.png' }
      : null,
    cr: cr
      ? { name: cr.name || 'Vocal de CR', role: 'Corporate Relations', email: cr.email, phone: cr.phone, img: cr.image || '/vocalias/social.png' }
      : null,
    cp: cp
      ? { name: cp.name || 'Contact Person', role: 'CP — EESTEC LC Madrid', email: cp.email, phone: cp.phone, img: cp.image || '/logo-eestec.png' }
      : null,
  };
}
