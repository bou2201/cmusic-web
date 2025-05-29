'use client';

import { ReactNode } from 'react';
import { LayoutSidebar } from './layout-sidebar';
import { LayoutHeader } from './layout-header';
import { LayoutFooter } from './layout-footer';
import { useSongStore } from '@/modules/song';
import { LayoutPlaylist } from './layout-playlist';

export function MainLayout({ children }: Readonly<{ children: ReactNode }>) {
  const track = useSongStore((state) => state.track);
  const openPlayList = useSongStore((state) => state.openPlayList);

  return (
    <>
      <LayoutSidebar />
      <div className="w-full flex flex-col overflow-x-hidden">
        <LayoutHeader />
        <main
          className={`overflow-y-auto ${track ? 'h-[calc(100vh-144px)]' : 'h-[calc(100vh-60px)]'}`}
        >
          {children}

          {/* <LayoutFooter /> */}
        </main>
      </div>
      {openPlayList ? (
        <div className="relative">
          <LayoutPlaylist />
        </div>
      ) : null}
    </>
  );
}
