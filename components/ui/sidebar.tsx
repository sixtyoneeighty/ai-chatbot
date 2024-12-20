'use client';

import * as React from 'react';
import { PanelLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent } from '@/components/ui/sheet';

const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_MOBILE = '18rem';
const SIDEBAR_WIDTH_ICON = '3rem';

type SidebarContext = {
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
};

const SidebarContext = React.createContext<SidebarContext | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }
  return context;
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'>
>(({ children, ...props }, ref) => {
  const [open, setOpen] = React.useState(true);
  const [openMobile, setOpenMobile] = React.useState(false);
  const isMobile = useIsMobile();

  return (
    <SidebarContext.Provider
      value={{
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile
      }}
    >
      <div ref={ref} {...props}>
        {children}
      </div>
    </SidebarContext.Provider>
  );
});
SidebarProvider.displayName = 'SidebarProvider';

interface SidebarProps extends React.ComponentPropsWithoutRef<'div'> {
  children: React.ReactNode;
}

function Sidebar({ children, className, ...props }: SidebarProps) {
  const { open, setOpen, openMobile, setOpenMobile, isMobile } = useSidebar();

  return (
    <>
      <aside
        className={cn(
          'fixed left-0 top-0 z-30 h-full w-full shrink-0 overflow-y-auto border-r bg-background transition-width duration-300 ease-in-out',
          isMobile ? 'hidden' : 'block',
          open ? `w-[${SIDEBAR_WIDTH}]` : `w-[${SIDEBAR_WIDTH_ICON}]`,
          className
        )}
        {...props}
      >
        {children}
      </aside>

      {isMobile && (
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent
            side="left"
            className="w-full border-r bg-background p-0 pt-12"
          >
            {children}
          </SheetContent>
        </Sheet>
      )}
    </>
  );
}

function SidebarToggle() {
  const { open, setOpen, setOpenMobile, isMobile } = useSidebar();

  return (
    <Button
      variant="ghost"
      size="icon"
      className="h-9 w-9"
      onClick={() => {
        if (isMobile) {
          setOpenMobile(true);
        } else {
          setOpen(!open);
        }
      }}
    >
      <PanelLeft className="h-4 w-4" />
      <span className="sr-only">Toggle Sidebar</span>
    </Button>
  );
}

interface SidebarMenuItemProps extends React.ComponentPropsWithoutRef<'div'> {
  children: React.ReactNode;
}

function SidebarMenuItem({ children, className, ...props }: SidebarMenuItemProps) {
  return (
    <div
      className={cn('flex flex-col space-y-1 px-2', className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface SidebarMenuButtonProps extends React.ComponentPropsWithoutRef<'button'> {
  isActive?: boolean;
  asChild?: boolean;
}

function SidebarMenuButton({ 
  children,
  className,
  isActive,
  asChild = false,
  ...props 
}: SidebarMenuButtonProps) {
  const Comp = asChild ? React.Fragment : 'button';
  return (
    <Comp
      className={cn(
        'flex w-full items-center rounded-lg px-2 py-2 text-sm font-medium',
        'hover:bg-accent hover:text-accent-foreground',
        isActive && 'bg-accent text-accent-foreground',
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
}

export { 
  Sidebar, 
  SidebarProvider, 
  SidebarToggle, 
  useSidebar,
  SidebarMenuItem,
  SidebarMenuButton
};
