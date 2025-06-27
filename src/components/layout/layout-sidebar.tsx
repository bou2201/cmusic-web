'use client';

import { Link, usePathname } from '@/i18n/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '../ui';
import Image from 'next/image';
import { NavigationWeb } from './layout-constants';
import { Routes } from '@/constants/routes';
import { GlobeIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { AudioPlayer, useSongStore } from '@/modules/song';
import { AuthLogin, useAuthStore } from '@/modules/auth';
import { useState } from 'react';

function LayoutSidebarHeader() {
  const { state } = useSidebar();

  return (
    <SidebarHeader className="my-2">
      <SidebarMenu className={`${state === 'expanded' ? 'px-2' : ''}`}>
        <SidebarMenuItem className="max-w-10 max-h-10">
          <Link href={Routes.Discover}>
            <Image
              className="w-full h-full object-cover"
              alt="logo"
              src="/logo.png"
              width={200}
              height={200}
            />
          </Link>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}

function LayoutSidebarContent() {
  const [openLogin, setOpenLogin] = useState<boolean>(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const pathname = usePathname();
  const navigation = NavigationWeb();

  return (
    <>
      <SidebarContent>
        {navigation.map((nav) => (
          <SidebarGroup key={nav.groupTitle}>
            <SidebarGroupLabel>{nav.groupTitle}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {nav.groupItems.map((grItems) => (
                  <SidebarMenuItem className="flex justify-center" key={grItems.title}>
                    <SidebarMenuButton
                      asChild
                      className="h-auto py-2.5"
                      tooltip={grItems.title}
                      isActive={pathname === grItems.url}
                    >
                      {grItems.key === 'favorite' && !isAuthenticated ? (
                        <div
                          className="cursor-pointer"
                          onClick={() => {
                            setOpenLogin(true);
                          }}
                        >
                          {grItems.icon}
                          <span className="font-semibold">{grItems.title}</span>
                        </div>
                      ) : (
                        <Link href={grItems.url}>
                          {grItems.icon}
                          <span className="font-semibold">{grItems.title}</span>
                        </Link>
                      )}
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      {openLogin ? <AuthLogin open={openLogin} setOpen={setOpenLogin} /> : null}
    </>
  );
}

function LayoutSidebarFooter() {
  const t = useTranslations<NextIntl.Namespace<'Navigation'>>('Navigation');
  const pathname = usePathname();

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem className="flex justify-center">
          <SidebarMenuButton asChild className="h-auto py-2.5" tooltip={t('language.label')}>
            <Link href={pathname} locale={t('language.keyChange')}>
              <GlobeIcon />
              <span>{t('language.label')}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}

export function LayoutSidebar() {
  const track = useSongStore((state) => state.track);

  return (
    <div className="relative">
      <Sidebar
        collapsible="icon"
        className={`top-2 left-2 h-auto [&>div]:rounded-xl !border-r-0 ${track ? 'bottom-20' : 'bottom-2'}`}
      >
        <LayoutSidebarHeader />
        <LayoutSidebarContent />
        <LayoutSidebarFooter />
      </Sidebar>

      <div className="fixed z-50 bottom-2 left-2 right-2">
        <AudioPlayer />
      </div>
    </div>
  );
}
