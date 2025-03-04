'use client';

import { Toaster, TooltipProvider } from '@/components/ui';

export function UiProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
      <Toaster />
    </>
  );
}
