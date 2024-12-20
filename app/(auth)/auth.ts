import { compare } from 'bcrypt-ts';
import NextAuth, { type User, type Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { getUser } from '@/lib/db/queries';

import { authConfig } from './auth.config';

interface ExtendedSession extends Session {
  user: User;
}

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {},
      async authorize({ email, password }: any) {
        try {
          console.log('Starting authorization for:', email);
          
          if (!email || !password) {
            console.log('Missing credentials');
            return null;
          }

          const users = await getUser(email);
          console.log('Found users:', users.length);
          
          if (users.length === 0) {
            console.log('No user found with email:', email);
            return null;
          }

          const user = users[0];
          if (!user.password) {
            console.log('User has no password set');
            return null;
          }

          // biome-ignore lint: Forbidden non-null assertion.
          const passwordsMatch = await compare(password, user.password!);
          console.log('Passwords match:', passwordsMatch);
          
          if (!passwordsMatch) {
            console.log('Password mismatch for user:', email);
            return null;
          }
          
          console.log('Successfully authorized user:', email);
          return {
            id: user.id,
            email: user.email,
          };
        } catch (error) {
          console.error('Authorization error:', error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }

      return token;
    },
    async session({
      session,
      token,
    }: {
      session: ExtendedSession;
      token: any;
    }) {
      if (session.user) {
        session.user.id = token.id as string;
      }

      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  debug: true,
});
