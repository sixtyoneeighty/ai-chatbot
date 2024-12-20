'use server';

import { z } from 'zod';

import { createUser, getUser } from '@/lib/db/queries';

import { signIn } from './auth';

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export interface LoginActionState {
  status: 'idle' | 'in_progress' | 'success' | 'failed' | 'invalid_data';
}

export const login = async (
  prevState: LoginActionState,
  formData: FormData,
): Promise<LoginActionState> => {
  // Always start with in_progress
  if (prevState.status === 'idle') {
    return { status: 'in_progress' };
  }

  try {
    console.log('Validating form data');
    const validatedData = authFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    console.log('Attempting sign in');
    const result = await signIn('credentials', {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    console.log('Sign in result:', result);

    if (!result) {
      console.error('No result from signIn');
      return { status: 'failed' };
    }

    if (result.error) {
      console.error('Sign in error:', result.error);
      return { status: 'failed' };
    }

    if (!result.ok) {
      console.error('Sign in not ok');
      return { status: 'failed' };
    }

    console.log('Sign in successful, redirecting...');
    return { status: 'success' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error('Validation error:', error);
      return { status: 'invalid_data' };
    }
    console.error('Sign in error:', error);
    return { status: 'failed' };
  }
};

export interface RegisterActionState {
  status:
    | 'idle'
    | 'in_progress'
    | 'success'
    | 'failed'
    | 'user_exists'
    | 'invalid_data';
}

export const register = async (
  _: RegisterActionState,
  formData: FormData,
): Promise<RegisterActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    const [user] = await getUser(validatedData.email);

    if (user) {
      return { status: 'user_exists' } as RegisterActionState;
    }
    await createUser(validatedData.email, validatedData.password);
    await signIn('credentials', {
      email: validatedData.email,
      password: validatedData.password,
      redirect: false,
    });

    return { status: 'success' };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: 'invalid_data' };
    }

    return { status: 'failed' };
  }
};
