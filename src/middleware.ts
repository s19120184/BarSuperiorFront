

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('bar_token')?.value;
  const { pathname } = req.nextUrl;

  // 1. Si no hay token y no está en /login, mandar al login
  if (!token && !pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 2. Si ya hay token e intenta entrar a /login, mandar a mesas
  if (token && pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/tables', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};