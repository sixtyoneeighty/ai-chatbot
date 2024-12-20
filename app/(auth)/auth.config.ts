import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    signOut: '/login',
    error: '/login',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isAuthPage = nextUrl.pathname.startsWith('/login') || 
                        nextUrl.pathname.startsWith('/register');
      
      // Redirect logged-in users away from auth pages
      if (isLoggedIn && isAuthPage) {
        return Response.redirect(new URL('/', nextUrl));
      }

      // Allow access to auth pages
      if (isAuthPage) {
        return true;
      }

      // Require auth for all other pages
      return isLoggedIn;
    },
    async jwt({ token, user, trigger, session }) {
      if (trigger === 'update' && session?.name) {
        token.name = session.name;
      }
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
