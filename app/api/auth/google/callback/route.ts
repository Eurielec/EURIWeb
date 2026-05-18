import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error || !code) {
    return NextResponse.redirect(new URL('/login?error=Google_Auth_Failed', request.url));
  }

  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
  const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return new NextResponse('Faltan credenciales de Google', { status: 500 });
  }

  const host = request.headers.get('host');
  const protocol = process.env.NODE_ENV === 'development' ? 'http' : 'https';
  const redirectUri = `${protocol}://${host}/api/auth/google/callback`;

  try {
    // 1. Intercambiar code por token
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });
    
    const tokenData = await tokenResponse.json();
    if (!tokenData.access_token) {
      throw new Error('No access token received');
    }

    // 2. Obtener información del usuario
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const googleUser = await userResponse.json();

    if (!googleUser.email) {
      throw new Error('Google didn\'t provide an email');
    }

    // 3. Buscar usuario en base de datos por Google ID o Email
    let dbUser = await prisma.user.findFirst({
      where: {
        OR: [
          { googleId: googleUser.id },
          { email: googleUser.email }
        ]
      }
    });

    if (!dbUser) {
      // Crear si no existe
      dbUser = await prisma.user.create({
        data: {
          name: googleUser.name,
          email: googleUser.email,
          googleId: googleUser.id,
          image: googleUser.picture,
          role: 'USER',
          emailVerified: true, // Google already verifies email
        }
      });
    } else if (!dbUser.googleId) {
      // Si existía por email pero no tenía googleId (ej: se registró manual), vincularlo
      dbUser = await prisma.user.update({
        where: { id: dbUser.id },
        data: { googleId: googleUser.id, image: dbUser.image || googleUser.picture, emailVerified: true }
      });
    }

    // 4. Crear sesión
    await createSession(dbUser.id, dbUser.role);

    const redirectPath = dbUser.role === 'ADMIN' ? '/admin' : '/perfil';
    return NextResponse.redirect(new URL(redirectPath, request.url));

  } catch (err) {
    console.error(err);
    return NextResponse.redirect(new URL('/login?error=Google_Error', request.url));
  }
}
