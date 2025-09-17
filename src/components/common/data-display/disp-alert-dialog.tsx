'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui';
import { X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { ComponentProps, ReactNode } from 'react';
import { NextIntl } from '~types/next-intl';

export type DispAlertDialogProps = {
  trigger?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  open?: boolean;
  setOpen?: (open: boolean) => void;
  onConfirm?: () => void;
  isPending?: boolean;
} & ComponentProps<typeof AlertDialogContent>;

export function DispAlertDialog({
  trigger,
  title,
  description,
  open,
  setOpen,
  onConfirm,
  isPending,
  ...props
}: DispAlertDialogProps) {
  const t = useTranslations<NextIntl.Namespace<'Component.alertDialog'>>('Component.alertDialog');

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      {trigger ? <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger> : null}
      <AlertDialogContent {...props}>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description ? <AlertDialogDescription>{description}</AlertDialogDescription> : null}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel
            onClick={() => {
              setOpen?.(false);
            }}
          >
            {t('cancel')}
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isPending}>
            {t('confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
