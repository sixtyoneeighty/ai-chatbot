'use client';

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import type { User } from 'next-auth';

interface SidebarClientProps {
  user: User | undefined;
  isCollapsed: boolean;
  children: React.ReactNode;
}

export function SidebarClient({ user, isCollapsed, children }: SidebarClientProps) {
  return (
    <div className="flex h-screen">
      <SidebarProvider defaultOpen={!isCollapsed}>
        <AppSidebar user={user} />
        <main className="flex flex-1 flex-col">
          <SidebarInset>{children}</SidebarInset>
        </main>
      </SidebarProvider>
    </div>
  );
}
