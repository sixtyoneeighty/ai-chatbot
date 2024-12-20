import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnChat = nextUrl.pathname === '/';
      const isOnRegister = nextUrl.pathname === '/register';
      const isOnLogin = nextUrl.pathname === '/login';

      // If user is logged in and tries to access auth pages, redirect to home
      if (isLoggedIn && (isOnLogin || isOnRegister)) {
        return Response.redirect(new URL('/', nextUrl));
      }

      // Always allow access to auth pages
      if (isOnLogin || isOnRegister) {
        return true;
      }

      // Protected routes
      if (isOnChat) {
        return isLoggedIn;
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
