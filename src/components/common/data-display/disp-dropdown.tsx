'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui';
import type { ComponentProps, MouseEventHandler, ReactNode } from 'react';

export type DispDropdownMenuProps = {
  key: string;
  label: ReactNode;
  shortcut?: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
  disabled?: boolean;
};

export type DispDropdownProps = {
  children: ReactNode;
  menu: DispDropdownMenuProps[];
  modal?: boolean;
  label?: ReactNode;
} & ComponentProps<typeof DropdownMenuContent>;

export function DispDropdown({ children, menu, modal, label, ...props }: DispDropdownProps) {
  return (
    <DropdownMenu modal={modal}>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" {...props}>
        {label ? (
          <>
            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        ) : null}

        {menu.map((item) => (
          <DropdownMenuItem
            className="cursor-pointer"
            key={item.key}
            disabled={item.disabled}
            onClick={item.onClick}
          >
            {item.label}
            {item.shortcut ? <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut> : null}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
