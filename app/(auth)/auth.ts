import { compare } from 'bcrypt-ts';
import NextAuth, { type User, type Session } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

import { getUser } from '@/lib/db/queries';

import { authConfig } from './auth.config';

interface ExtendedSession extends Session {
  user: User;
}

const handler = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {},
      async authorize({ email, password }: any) {
        console.log('Attempting login with email:', email);
        const users = await getUser(email);
        console.log('Found users:', users.length);
        if (users.length === 0) {
          console.log('No user found');
          return null;
        }
        // biome-ignore lint: Forbidden non-null assertion.
        const passwordsMatch = await compare(password, users[0].password!);
        console.log('Password match:', passwordsMatch);
        if (!passwordsMatch) {
          console.log('Password mismatch');
          return null;
        }
        console.log('Login successful');
        return users[0] as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      console.log('JWT callback:', { token });
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
      console.log('Session callback:', { session });
      return session;
    },
  },
});

export const { auth, signIn, signOut } = handler;
