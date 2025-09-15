'use client';

import { quickSand } from '@/app/font';
import { Toaster, TooltipProvider } from '@/components/ui';

export function UiProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TooltipProvider delayDuration={100}>{children}</TooltipProvider>
      <Toaster
        toastOptions={{
          className: quickSand.className,
        }}
        position="top-center"
        swipeDirections={['top', 'bottom']}
        duration={5000}
      />
    </>
  );
}
