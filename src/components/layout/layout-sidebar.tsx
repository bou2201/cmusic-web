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
  SidebarTrigger,
  useSidebar,
} from '../ui';
import Image from 'next/image';
import { Navigation } from './layout-constants';
import { Routes } from '@/constants/routes';
import { GlobeIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';

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
  const pathname = usePathname();
  const navigation = Navigation();

  return (
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
                    <Link href={grItems.url}>
                      {grItems.icon}
                      <span>{grItems.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}
    </SidebarContent>
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
  return (
    <>
      <Sidebar
        collapsible="icon"
        className="top-2 bottom-2 left-2 h-auto [&>div]:rounded-2xl !border-r-0"
      >
        <LayoutSidebarHeader />
        <LayoutSidebarContent />
        <LayoutSidebarFooter />
      </Sidebar>
    </>
  );
}
