import * as React from 'react';

import { SidebarToggle, useSidebar } from './ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from './ui/tooltip';

import { SidebarLeftIcon } from './icons';
import { Button } from './ui/button';

export function SidebarToggleButton({
  className,
}: React.ComponentPropsWithoutRef<any>) {
  const { open, setOpen, openMobile, setOpenMobile, isMobile } = useSidebar();

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          onClick={() => {
            if (isMobile) {
              setOpenMobile(!openMobile);
            } else {
              setOpen(!open);
            }
          }}
          variant="outline"
          className="md:px-2 md:h-fit"
        >
          <SidebarLeftIcon size={16} />
        </Button>
      </TooltipTrigger>
      <TooltipContent align="start">Toggle Sidebar</TooltipContent>
    </Tooltip>
  );
}
