import { NextResponse, NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

  if (!GOOGLE_CLIENT_ID) {
    return new NextResponse('Error: GOOGLE_CLIENT_ID no existe en .env', { status: 500 });
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || `${process.env.NODE_ENV === 'development' ? 'http' : 'https'}://${request.headers.get('host')}`;
  const redirectUri = `${baseUrl}/api/auth/google/callback`;

  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth` +
    `?client_id=${GOOGLE_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=openid email profile` +
    `&access_type=offline`;

  return NextResponse.redirect(authUrl);
}
