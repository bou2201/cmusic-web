'use client';

import { ReactNode } from 'react';
import { LayoutSidebar } from './layout-sidebar';
import { LayoutHeader } from './layout-header';

export function MainLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <LayoutSidebar />
      <div className="w-full">
        <LayoutHeader />
        <main className="pt-3">{children}</main>
      </div>
    </>
  );
}
