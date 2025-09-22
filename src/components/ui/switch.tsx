'use client';

import * as React from 'react';
import * as SwitchPrimitive from '@radix-ui/react-switch';

import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

function Switch({
  className,
  isLoading,
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & { isLoading?: boolean }) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      className={cn(
        'peer data-[state=checked]:bg-primary-pink/40 data-[state=unchecked]:bg-input focus-visible:border-ring focus-visible:ring-ring/50 inline-flex h-5 w-9 shrink-0 items-center rounded-full border-2 border-transparent shadow-xs transition-all outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer',
        className,
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2
          className={cn(
            'animate-spin block size-3.5 transition-transform',
            props.checked ? 'translate-x-4' : 'translate-x-0',
          )}
        />
      ) : (
        <SwitchPrimitive.Thumb
          data-slot="switch-thumb"
          className={cn(
            'bg-background pointer-events-none block size-3.5 rounded-full ring-0 shadow-lg transition-transform data-[state=checked]:translate-x-4 data-[state=checked]:bg-primary-pink data-[state=unchecked]:translate-x-0',
          )}
        />
      )}
    </SwitchPrimitive.Root>
  );
}

export { Switch };
