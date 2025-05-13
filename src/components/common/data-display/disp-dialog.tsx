'use client';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui';
import { X } from 'lucide-react';
import { ComponentProps, ReactNode } from 'react';

export type DisDialogProps = {
  children: ReactNode;
  trigger?: ReactNode;
  modal?: boolean;
  title: ReactNode;
  description?: ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
} & ComponentProps<typeof DialogContent>;

export function DisDialog({
  children,
  trigger,
  modal,
  title,
  description,
  open,
  setOpen,
  ...props
}: DisDialogProps) {
  return (
    <Dialog modal={modal} open={open} onOpenChange={setOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}
      <DialogContent onInteractOutside={(e) => e.preventDefault()} {...props}>
        <DialogClose
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
          onClick={(e) => {
            e.preventDefault();
            setOpen?.(false);
          }}
        >
          <X className="!h-4 !w-4" />
          <span className="sr-only">Close</span>
        </DialogClose>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
