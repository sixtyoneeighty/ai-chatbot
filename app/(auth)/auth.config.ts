import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/sign-in',
    newUser: '/',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnChat = nextUrl.pathname.startsWith('/');
      const isOnRegister = nextUrl.pathname.startsWith('/register');
      const isOnSignIn = nextUrl.pathname.startsWith('/sign-in');

      if (isLoggedIn && (isOnSignIn || isOnRegister)) {
        return Response.redirect(new URL('/', nextUrl as unknown as URL));
      }

      if (isOnRegister || isOnSignIn) {
        return true; // Always allow access to register and login pages
      }

      if (isOnChat) {
        if (isLoggedIn) return true;
        return false; // Redirect unauthenticated users to login page
      }

      if (isLoggedIn) {
        return Response.redirect(new URL('/', nextUrl as unknown as URL));
      }

      return true;
    },
  },
} satisfies NextAuthConfig;
