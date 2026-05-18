'use server';

import { prisma } from '@/lib/prisma';
import * as bcrypt from 'bcrypt';
import { createSession, deleteSession, getUserSession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { geocodeCity } from '@/lib/geocode';
import { sendVerificationEmail } from '@/lib/email';

import { LoginSchema, RegisterSchema, CompleteProfileSchema } from '@/lib/schemas';

export async function loginAction(prevState: unknown, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const result = LoginSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { email, password } = result.data;

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return { error: 'Credenciales inválidas.' };
  }

  if (!user.password) {
    return { error: 'Esta cuenta usa Google Auth. Por favor, haz clic en "Continuar con Google".' };
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    return { error: 'Credenciales inválidas.' };
  }

  // Si el email no está verificado, reenviar código y redirigir
  if (!user.emailVerified) {
    await generateAndSendCode(user.id, user.email);
    redirect(`/verificar-email?email=${encodeURIComponent(user.email)}`);
  }

  await createSession(user.id, user.role, user.vocalia);

  if (user.role === 'ADMIN' || user.role === 'VOCAL') {
    redirect('/admin');
  } else {
    redirect('/perfil');
  }
}

export async function logoutAction() {
  await deleteSession();
  redirect('/login');
}

// Helper to generate 6-digit code and send email
async function generateAndSendCode(userId: string, email: string) {
  // Delete any existing tokens for this user
  await prisma.verificationToken.deleteMany({ where: { email } });

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  await prisma.verificationToken.create({
    data: {
      token: code,
      email,
      userId,
      expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
    },
  });

  await sendVerificationEmail(email, code);
}

export async function registerAction(prevState: unknown, formData: FormData) {
  const data = Object.fromEntries(formData.entries());
  const result = RegisterSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { name, email, password, phone, address, city, province, zipCode, university, academicYear } = result.data;

  const existingUser = await prisma.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    if (!existingUser.emailVerified) {
      // Re-send verification
      await generateAndSendCode(existingUser.id, existingUser.email);
      redirect(`/verificar-email?email=${encodeURIComponent(email)}`);
    }
    return { error: 'Ese email ya está registrado.' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const geo = await geocodeCity(city, province);

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      phone,
      address,
      city,
      province,
      zipCode,
      university,
      academicYear,
      latitude: geo?.latitude,
      longitude: geo?.longitude,
      role: 'GUEST',
      emailVerified: false,
    },
  });

  // Generate code and send email
  await generateAndSendCode(user.id, user.email);

  // Redirect to verification page (NOT auto-login)
  redirect(`/verificar-email?email=${encodeURIComponent(email)}`);
}

export async function verifyEmailAction(prevState: unknown, formData: FormData) {
  const email = formData.get('email') as string;
  const code = formData.get('code') as string;

  if (!email || !code) {
    return { error: 'Código y email son obligatorios.' };
  }

  const token = await prisma.verificationToken.findFirst({
    where: { email, token: code },
  });

  if (!token) {
    return { error: 'Código incorrecto. Revisa el email e inténtalo de nuevo.' };
  }

  if (token.expiresAt < new Date()) {
    await prisma.verificationToken.delete({ where: { id: token.id } });
    return { error: 'El código ha expirado. Solicita uno nuevo.' };
  }

  // Mark user as verified
  const user = await prisma.user.update({
    where: { id: token.userId },
    data: { emailVerified: true },
  });

  // Clean up tokens
  await prisma.verificationToken.deleteMany({ where: { email } });

  // Auto-login
  await createSession(user.id, user.role, user.vocalia);

  redirect('/perfil');
}

export async function resendVerificationAction(email: string) {
  if (!email) return { error: 'Email no proporcionado.' };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return { error: 'No se encontró una cuenta con ese email.' };
  if (user.emailVerified) return { error: 'Esta cuenta ya está verificada.' };

  await generateAndSendCode(user.id, user.email);
  return { success: true };
}

export async function completeProfileAction(prevState: unknown, formData: FormData) {
  const session = await getUserSession();
  if (!session) redirect('/login');

  const data = Object.fromEntries(formData.entries());
  const result = CompleteProfileSchema.safeParse(data);

  if (!result.success) {
    return { error: result.error.issues[0].message };
  }

  const { phone, address, city, province, zipCode } = result.data;

  const geo = await geocodeCity(city, province);

  await prisma.user.update({
    where: { id: session.userId },
    data: {
      phone,
      address,
      city,
      province,
      zipCode,
      latitude: geo?.latitude,
      longitude: geo?.longitude,
    },
  });

  redirect('/perfil');
}

export async function getSessionAction() {
  const session = await getUserSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { name: true, image: true }
  });

  return {
    ...session,
    name: user?.name || null,
    image: user?.image || null
  };
}
