'use client';

import { Link, usePathname, useRouter } from '@/i18n/navigation';
import { Locale, routing } from '@/i18n/routing';
import { DispDropdown, DispDropdownMenuProps } from '@/components/common';
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
  SidebarSeparator,
  useSidebar,
} from '../ui';
import Image from 'next/image';
import { NavigationDashboard, NavigationType, NavigationWeb } from './layout-constants';
import { Routes } from '@/constants/routes';
import { CheckIcon, GlobeIcon, PlusIcon } from 'lucide-react';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { AudioPlayer, useSongStore } from '@/modules/song';
import { AuthLogin, useAuthStore } from '@/modules/auth';
import { useCallback, useMemo, useState } from 'react';
import { Role } from '@/modules/user';
import { FormCouPlaylist, ViewPlaylistSidebar } from '@/modules/playlist';

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
  const [openCreatePlaylist, setOpenCreatePlaylist] = useState<boolean>(false);

  const t = useTranslations<NextIntl.Namespace<'Navigation'>>('Navigation');
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);
  const pathname = usePathname();
  const navigation = NavigationWeb();
  const navigationDashboard = NavigationDashboard();

  const isPermissionAdmin = user?.role === Role.Admin && pathname.includes('/admin');

  const renderNavigation = useCallback(
    (navi: NavigationType[]) => {
      return navi.map((nav) => (
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
      ));
    },
    [isAuthenticated, pathname],
  );

  return (
    <>
      <SidebarContent>
        {renderNavigation(isPermissionAdmin ? navigationDashboard : navigation)}

        {!isPermissionAdmin ? (
          <>
            {/* <SidebarSeparator /> */}
            <SidebarGroup className='pt-0'>
              <SidebarGroupContent>
                <SidebarMenu>
                  <SidebarMenuItem className="flex justify-center">
                    <SidebarMenuButton
                      asChild
                      className="h-auto py-2.5 bg-primary text-background hover:bg-primary hover:text-background"
                      tooltip={t('playlist.action.create')}
                    >
                      <div
                        className="cursor-pointer"
                        onClick={() => {
                          if (isAuthenticated) {
                            setOpenCreatePlaylist(true);
                          } else {
                            setOpenLogin(true);
                          }
                        }}
                      >
                        <PlusIcon />
                        <span className="font-semibold">{t('playlist.action.create')}</span>
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="group-data-[collapsible=icon]:hidden h-full overflow-y-auto">
              <ViewPlaylistSidebar />
            </SidebarGroup>
          </>
        ) : null}
      </SidebarContent>

      {openLogin ? <AuthLogin open={openLogin} setOpen={setOpenLogin} /> : null}

      {openCreatePlaylist ? (
        <FormCouPlaylist open={openCreatePlaylist} setOpen={setOpenCreatePlaylist} />
      ) : null}
    </>
  );
}

const LANGUAGE_LABELS: Record<Locale, string> = {
  en: 'English',
  vi: 'Tiếng Việt',
  zh: '中文',
};

function LayoutSidebarFooter() {
  const t = useTranslations<NextIntl.Namespace<'Navigation'>>('Navigation');
  const pathname = usePathname();
  const router = useRouter();
  const { locale } = useParams<{ locale: Locale }>();

  const languageMenu = useMemo<DispDropdownMenuProps[]>(
    () =>
      routing.locales.map((loc) => ({
        key: `language-${loc}`,
        label: LANGUAGE_LABELS[loc],
        shortcut: loc === locale ? <CheckIcon /> : null,
        disabled: loc === locale,
        onClick: () => {
          router.replace(pathname, { locale: loc });
        },
      })),
    [locale, pathname, router],
  );

  return (
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem className="flex justify-center">
          <DispDropdown menu={languageMenu} side="top" align="start" className="w-(--radix-popper-anchor-width)">
            <SidebarMenuButton className="h-auto py-2.5" tooltip={t('language.label')}>
              <GlobeIcon />
              <span>{LANGUAGE_LABELS[locale] ?? t('language.label')}</span>
            </SidebarMenuButton>
          </DispDropdown>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  );
}

export function LayoutSidebar({ type }: { type: 'web' | 'dashboard' }) {
  const track = useSongStore((state) => state.track);

  return type === 'web' ? (
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
  ) : (
    <Sidebar
      collapsible="icon"
      className={`top-2 left-2 h-auto [&>div]:rounded-xl !border-r-0 bottom-2`}
    >
      <LayoutSidebarHeader />
      <LayoutSidebarContent />
      <LayoutSidebarFooter />
    </Sidebar>
  );
}
