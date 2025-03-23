'use client';

import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { Button, Separator, SidebarTrigger } from '../ui';
import { useHistoryTracker } from '@/hooks/use-history-tracker';

export function LayoutHeader() {
  const { canGoBack, canGoForward, handleGoBack, handleGoForward } = useHistoryTracker();

  return (
    <section className="flex items-center justify-between gap-5">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="cursor-pointer opacity-80" variant="secondary" size="icon" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer"
          disabled={!canGoBack}
          onClick={handleGoBack}
        >
          <ChevronLeftIcon />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="cursor-pointer"
          disabled={!canGoForward}
          onClick={handleGoForward}
        >
          <ChevronRightIcon />
        </Button>
      </div>
    </section>
  );
}
