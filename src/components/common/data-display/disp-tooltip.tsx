'use client';

import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui';
import type { ComponentProps, ReactNode } from 'react';

export type DispTooltipProps = {
  children: ReactNode;
  content: ReactNode;
} & ComponentProps<typeof TooltipContent>;

export function DispTooltip({ children, content, ...props }: DispTooltipProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent sideOffset={10} side="bottom" {...props}>
        {content}
      </TooltipContent>
    </Tooltip>
  );
}
