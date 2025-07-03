'use client';

import { ReactNode } from 'react';
import { LayoutSidebar } from './layout-sidebar';
import { LayoutHeader } from './layout-header';
import { LayoutFooter } from './layout-footer';
import { useSongStore } from '@/modules/song';
import { LayoutPlaylist } from './layout-playlist';
import { useIsMobile } from '@/hooks/use-mobile';

export function MainLayout({ children }: Readonly<{ children: ReactNode }>) {
  const track = useSongStore((state) => state.track);
  const openPlayList = useSongStore((state) => state.openPlayList);
  const isMobile = useIsMobile();

  return (
    <>
      <LayoutSidebar type="web" />
      <div className="w-full flex flex-col overflow-x-hidden">
        <LayoutHeader type="web" />
        <main
          className={`overflow-y-auto ${track ? 'h-[calc(100vh-144px)]' : 'h-[calc(100vh-60px)]'}`}
        >
          {children}

          {/* <LayoutFooter /> */}
        </main>
      </div>

      {openPlayList && !isMobile ? (
        <div className="relative">
          <LayoutPlaylist />
        </div>
      ) : null}
    </>
  );
}

export function AdminLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <>
      <LayoutSidebar type="dashboard" />
      <div className="w-full flex flex-col overflow-x-hidden">
        <LayoutHeader type="dashboard" />
        <main className="overflow-y-auto h-[calc(100vh-72px)]">{children}</main>
      </div>
    </>
  );
}
