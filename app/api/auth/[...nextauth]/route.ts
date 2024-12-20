import { type NextRequest } from 'next/server';
import { auth } from '@/app/(auth)/auth';

export const GET = (request: NextRequest) => auth(request);
export const POST = (request: NextRequest) => auth(request);
