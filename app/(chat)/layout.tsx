import { cookies } from 'next/headers';
import Script from 'next/script';

import { auth } from '../(auth)/auth';
import { SidebarClient } from './sidebar-client';

interface LayoutProps {
  children: React.ReactNode;
}

export default async function Layout({ children }: LayoutProps) {
  const [session, cookieStore] = await Promise.all([
    auth(),
    cookies()
  ]);

  const isCollapsed = cookieStore.get('sidebar:state')?.value !== 'true';

  return (
    <>
      <Script
        src="https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js"
        strategy="beforeInteractive"
      />
      <SidebarClient
        user={session?.user}
        isCollapsed={isCollapsed}
      >
        {children}
      </SidebarClient>
    </>
  );
}
