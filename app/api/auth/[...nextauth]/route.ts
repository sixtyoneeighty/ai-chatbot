import { type NextRequest } from 'next/server';
import NextAuth from 'next-auth';
import { authConfig } from '@/app/(auth)/auth.config';

const handler = NextAuth(authConfig);

export const GET = handler.auth;
export const POST = handler.auth;
