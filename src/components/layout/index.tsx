'use client';

import { ReactNode } from 'react';
import { LayoutSidebar } from './layout-sidebar';
import { LayoutHeader } from './layout-header';
import { useSongStore } from '@/modules/song';

export function MainLayout({ children }: Readonly<{ children: ReactNode }>) {
  const track = useSongStore((state) => state.track);

  return (
    <>
      <LayoutSidebar />
      <div className="w-full flex flex-col overflow-x-hidden">
        <LayoutHeader />
        <main
          className={`overflow-y-auto ${track ? 'h-[calc(100vh-142px)]' : 'h-[calc(100vh-60px)]'}`}
        >
          {children}
        </main>
      </div>
    </>
  );
}
