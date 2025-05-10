'use client';

import { ChevronLeftIcon, ChevronRightIcon, KeyIcon, UserRoundIcon } from 'lucide-react';
import { Button, InputDebounce, Separator, SidebarTrigger } from '../ui';
import { useHistoryTracker } from '@/hooks/use-history-tracker';
import { DispDropdown, DispDropdownMenuProps } from '../common';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';

function LayoutHeaderDropdown() {
  const t = useTranslations<NextIntl.Namespace<'Navigation.action'>>('Navigation.action');

  const menu: DispDropdownMenuProps[] = [
    {
      key: 'act-login',
      label: t('login'),
    },
    {
      key: 'act-signup',
      label: t('signup'),
    },
  ];

  return (
    <div className="flex flex-1 items-center justify-end gap-3">
      <div className="min-w-72">
        <InputDebounce placeholder={t('search')} className="rounded-full" />
      </div>
      <DispDropdown menu={menu} modal={false}>
        <Button variant="secondary" size="icon" className="rounded-full h-10 w-10">
          <UserRoundIcon size={30} />
        </Button>
      </DispDropdown>
    </div>
  );
}

export function LayoutHeader() {
  const { canGoBack, canGoForward, handleGoBack, handleGoForward } = useHistoryTracker();

  return (
    <section className="flex items-center justify-between gap-5 sticky top-2 bg-background pb-2">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="cursor-pointer opacity-80" variant="secondary" size="icon" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <Button variant="outline" size="icon" disabled={!canGoBack} onClick={handleGoBack}>
          <ChevronLeftIcon />
        </Button>
        <Button variant="outline" size="icon" disabled={!canGoForward} onClick={handleGoForward}>
          <ChevronRightIcon />
        </Button>
      </div>

      <LayoutHeaderDropdown />
    </section>
  );
}
