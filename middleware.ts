import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getUserSession } from './lib/auth';

export async function middleware(request: NextRequest) {
  const session = await getUserSession();
  const path = request.nextUrl.pathname;

  // 1. Proteger panel de administración (Requiere ADMIN o VOCAL)
  if (path.startsWith('/admin')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }

    // Rutas restringidas SOLO para ADMIN
    const restrictedAdminPaths = ['/admin/junta', '/admin/users', '/admin/archivo'];
    const isRestrictedPath = restrictedAdminPaths.some(restrictedPath => path.startsWith(restrictedPath));

    if (isRestrictedPath && session.role !== 'ADMIN') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    if (session.role !== 'ADMIN' && session.role !== 'VOCAL') {
      return NextResponse.redirect(new URL('/perfil', request.url));
    }
  }

  // 2. Proteger área de perfil (Requiere estar logueado, sin importar rol)
  if (path.startsWith('/perfil')) {
    if (!session) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // 3. Prevenir acceso de logueados a las páginas de Login/Registro
  if (path.startsWith('/login') || path.startsWith('/register')) {
    if (session) {
      if (session.role === 'ADMIN' || session.role === 'VOCAL') {
         return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.redirect(new URL('/perfil', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
