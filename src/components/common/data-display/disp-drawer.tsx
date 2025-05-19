'use client';

import { Drawer, DrawerContent, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui';
import { ComponentProps, ReactNode } from 'react';

type DispDrawerProps = {
  children: ReactNode;
  trigger?: ReactNode;
  title?: ReactNode;
  modal?: boolean;
  open?: boolean;
  setOpen?: (open: boolean) => void;
} & ComponentProps<typeof DrawerContent>;

export function DispDrawer({ children, trigger, title, modal, open, setOpen, ...props }: DispDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={setOpen} modal={modal}>
      {trigger && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent {...props}>
        <DrawerHeader>
          <DrawerTitle>{title ?? ''}</DrawerTitle>
        </DrawerHeader>
        {children}
      </DrawerContent>
    </Drawer>
  );
}
