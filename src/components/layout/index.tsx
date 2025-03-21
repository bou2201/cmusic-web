'use client';

import { ReactNode } from 'react';
import { LayoutSidebar } from './layout-sidebar';

export function MainLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <LayoutSidebar />
      <main>{children}</main>
    </>
  );
}
