'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui';
import type { ComponentProps, MouseEventHandler, ReactNode } from 'react';

export type DispDropdownMenuProps = {
  key: string;
  label: ReactNode;
  shortcut?: ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement>;
  disabled?: boolean;
  sub?: DispDropdownMenuProps[];
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

        {menu.map((item) =>
          item.sub ? (
            <DropdownMenuSub key={item.key}>
              <DropdownMenuSubTrigger>{item.label}</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  {item.sub.map((subItem) => (
                    <DropdownMenuItem
                      className="cursor-pointer"
                      key={subItem.key}
                      disabled={subItem.disabled}
                      onClick={subItem.onClick}
                    >
                      {subItem.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
          ) : (
            <DropdownMenuItem
              className="cursor-pointer"
              key={item.key}
              disabled={item.disabled}
              onClick={item.onClick}
            >
              <span className='font-semibold'>{item.label}</span>
              {item.shortcut ? <DropdownMenuShortcut>{item.shortcut}</DropdownMenuShortcut> : null}
            </DropdownMenuItem>
          ),
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
