import NextAuth from 'next-auth';

import { authConfig } from '@/app/(auth)/auth.config';
import { auth } from '@/app/(auth)/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export default NextAuth(authConfig).auth;

export async function middleware(request: NextRequest) {
  const session = await auth();
  const isAuthPage = request.nextUrl.pathname === '/login' || 
                    request.nextUrl.pathname === '/register';

  if (session && isAuthPage) {
    // If logged in and trying to access auth page, redirect to home
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (!session && !isAuthPage) {
    // If not logged in and trying to access protected page, redirect to login
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
