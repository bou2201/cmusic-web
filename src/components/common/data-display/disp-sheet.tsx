'use client';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui';
import { ComponentProps, ReactNode } from 'react';

type DisSheetpProps = {
  children: ReactNode;
  trigger?: ReactNode;
  title?: ReactNode;
  modal?: boolean;
  description?: ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
} & ComponentProps<typeof SheetContent>;

export function DispSheet({
  children,
  trigger,
  title,
  modal,
  description,
  open,
  setOpen,
  ...props
}: DisSheetpProps) {
  return (
    <Sheet open={open} onOpenChange={setOpen} modal={modal}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent {...props}>
        <SheetHeader>
          <SheetTitle>{title ?? ''}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        {children}
      </SheetContent>
    </Sheet>
  );
}
