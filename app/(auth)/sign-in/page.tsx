import { auth } from '@/app/(auth)/auth';
import { SignInForm } from '@/components/sign-in-form';
import { redirect } from 'next/navigation';

export default async function SignInPage() {
  const session = await auth();
  if (session?.user) {
    redirect('/');
  }

  return (
    <div className="flex h-[calc(100vh-theme(spacing.16))] items-center justify-center py-10">
      <SignInForm />
    </div>
  );
}
