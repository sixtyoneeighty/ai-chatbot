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

interface SidebarProviderProps extends React.ComponentPropsWithoutRef<'div'> {
  defaultOpen?: boolean;
}

const SidebarProvider = React.forwardRef<HTMLDivElement, SidebarProviderProps>(
  ({ children, defaultOpen = true, ...props }, ref) => {
    const [open, setOpen] = React.useState(defaultOpen);
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
  }
);
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

interface SidebarHeaderProps extends React.ComponentPropsWithoutRef<'div'> {
  children: React.ReactNode;
}

function SidebarHeader({ children, className, ...props }: SidebarHeaderProps) {
  return (
    <div
      className={cn('flex h-14 items-center px-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface SidebarContentProps extends React.ComponentPropsWithoutRef<'div'> {
  children: React.ReactNode;
}

function SidebarContent({ children, className, ...props }: SidebarContentProps) {
  return (
    <div
      className={cn('flex-1 overflow-y-auto', className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface SidebarFooterProps extends React.ComponentPropsWithoutRef<'div'> {
  children: React.ReactNode;
}

function SidebarFooter({ children, className, ...props }: SidebarFooterProps) {
  return (
    <div
      className={cn('flex items-center border-t p-4', className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface SidebarMenuProps extends React.ComponentPropsWithoutRef<'div'> {
  children: React.ReactNode;
}

function SidebarMenu({ children, className, ...props }: SidebarMenuProps) {
  return (
    <div
      className={cn('flex flex-col gap-1', className)}
      {...props}
    >
      {children}
    </div>
  );
}

interface SidebarMenuActionProps extends React.ComponentPropsWithoutRef<'button'> {
  icon?: React.ReactNode;
  showOnHover?: boolean;
}

function SidebarMenuAction({ 
  children,
  className,
  icon,
  showOnHover,
  ...props 
}: SidebarMenuActionProps) {
  return (
    <button
      className={cn(
        'flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium',
        'hover:bg-accent hover:text-accent-foreground',
        showOnHover && 'opacity-0 group-hover:opacity-100',
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

interface SidebarGroupProps extends React.ComponentPropsWithoutRef<'div'> {
  title?: string;
  children: React.ReactNode;
}

function SidebarGroup({ title, children, className, ...props }: SidebarGroupProps) {
  return (
    <div className={cn('space-y-2', className)} {...props}>
      {title && (
        <h4 className="px-2 text-sm font-semibold">{title}</h4>
      )}
      {children}
    </div>
  );
}

interface SidebarGroupContentProps extends React.ComponentPropsWithoutRef<'div'> {
  children: React.ReactNode;
}

function SidebarGroupContent({ children, className, ...props }: SidebarGroupContentProps) {
  return (
    <div className={cn('space-y-1', className)} {...props}>
      {children}
    </div>
  );
}

interface SidebarInsetProps extends React.ComponentPropsWithoutRef<'div'> {
  children: React.ReactNode;
}

function SidebarInset({ children, className, ...props }: SidebarInsetProps) {
  return (
    <div
      className={cn('relative z-20 overflow-hidden', className)}
      {...props}
    >
      {children}
    </div>
  );
}

export { 
  Sidebar, 
  SidebarProvider, 
  SidebarToggle, 
  useSidebar,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuAction,
  SidebarGroup,
  SidebarGroupContent,
  SidebarInset
};
