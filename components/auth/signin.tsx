'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/app/(auth)/auth';

export function SignIn() {
  return (
    <div className="w-full max-w-[400px] p-6 bg-white rounded-lg shadow-lg">
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['github']}
        redirectTo={`${window.location.origin}/`}
      />
    </div>
  );
}
