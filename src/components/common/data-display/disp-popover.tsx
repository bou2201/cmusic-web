'use client';

import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui';
import { ReactNode } from 'react';

export type DispPopoverProps = {
  trigger: ReactNode;
  open: boolean;
  setOpen: (open: boolean) => void;
  children: ReactNode;
  modal?: boolean;
  className?: string;
  align?: 'end' | 'center' | 'start';
};

export const DispPopover = ({
  trigger,
  open,
  setOpen,
  children,
  modal = true,
  className,
  align = 'end',
}: DispPopoverProps) => {
  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>
      <PopoverContent align={align} className={className}>
        {children}
      </PopoverContent>
    </Popover>
  );
};
