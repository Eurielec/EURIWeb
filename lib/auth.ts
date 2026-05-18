import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';

const secretKey = process.env.JWT_SECRET || 'clave_secreta_super_segura_de_eurielec_para_desarrollo';
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: { userId: string; role: string; vocalia?: string | null; expires: Date }) {
  return await new SignJWT(payload as unknown as JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('1d') // La sesión expira en 1 día
    .sign(key);
}

export async function decrypt(input: string): Promise<{ userId: string; role: string; vocalia?: string | null } | null> {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload as { userId: string; role: string; vocalia?: string | null };
  } catch {
    return null;
  }
}

export async function createSession(userId: string, role: string, vocalia?: string | null) {
  const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 día
  const session = await encrypt({ userId, role, vocalia, expires });

  const cookieStore = await cookies();
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    expires,
    sameSite: 'lax',
    path: '/',
  });
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}
export async function getUserSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;
  return await decrypt(session);
}
