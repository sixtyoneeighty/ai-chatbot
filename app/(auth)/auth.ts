import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';

export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        // Add your authentication logic here
        // This is a placeholder that allows any credentials
        return {
          id: '1',
          name: 'User',
          email: 'user@example.com',
        };
      },
    }),
  ],
});
