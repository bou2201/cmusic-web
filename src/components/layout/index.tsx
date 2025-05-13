'use client';

import { ReactNode } from 'react';
import { LayoutSidebar } from './layout-sidebar';
import { LayoutHeader } from './layout-header';

export function MainLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <LayoutSidebar />
      <div className="w-full flex flex-col">
        <LayoutHeader />
        <main className="overflow-y-auto h-[calc(100vh-60px)]">{children}</main>
      </div>
    </>
  );
}
