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
          console.log('Attempting to authorize user:', email);
          const users = await getUser(email);
          console.log('Found users:', users.length);
          
          if (users.length === 0) {
            console.log('No user found with email:', email);
            return null;
          }
          
          // biome-ignore lint: Forbidden non-null assertion.
          const passwordsMatch = await compare(password, users[0].password!);
          console.log('Passwords match:', passwordsMatch);
          
          if (!passwordsMatch) {
            console.log('Password mismatch for user:', email);
            return null;
          }
          
          console.log('Successfully authorized user:', email);
          return users[0] as any;
        } catch (error) {
          console.error('Authorization error:', error);
          throw error;
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
});
