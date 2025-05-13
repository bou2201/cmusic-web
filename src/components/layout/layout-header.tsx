'use client';

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  KeyRound,
  LogIn,
  LogOut,
  RotateCcw,
  User,
  UserRoundPen,
} from 'lucide-react';
import { Button, InputSearch, Separator, SidebarTrigger } from '../ui';
import { useHistoryTracker } from '@/hooks/use-history-tracker';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { DispDropdown, DispDropdownMenuProps } from '../common';
import { AuthLogin, useAuthStore } from '@/modules/auth';
import { DialogSearchSong } from '@/modules/song';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/modules/auth/service';
import { toast } from 'sonner';

function UserButton() {
  const [openLogin, setOpenLogin] = useState<boolean>(false);

  const { user, isAuthenticated, clearAuth } = useAuthStore((state) => state);
  const t = useTranslations<NextIntl.Namespace<'Header'>>('Header');
  const tAuth = useTranslations<NextIntl.Namespace<'Auth'>>('Auth');

  const { mutate: exucuteLogout } = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      toast(tAuth('alert.loginSuccess'));
    },
    onError: () => {
      toast.error(tAuth('alert.loginFailed'));
    },
  });

  const getMenuDropdown = (): DispDropdownMenuProps[] => {
    if (isAuthenticated && user) {
      return [
        {
          label: t('user.profile'),
          key: 'profile',
          shortcut: <UserRoundPen />,
        },
        {
          label: t('user.changePassword'),
          key: 'changePassword',
          shortcut: <RotateCcw />,
        },
        {
          label: t('user.logout'),
          key: 'logout',
          shortcut: <LogOut />,
          onClick: () => {
            exucuteLogout();
          },
        },
      ];
    }

    return [
      {
        label: t('user.login'),
        key: 'login',
        shortcut: <LogIn />,
        onClick: () => {
          setOpenLogin(true);
        },
      },
      {
        label: t('user.register'),
        key: 'register',
        shortcut: <KeyRound />,
      },
    ];
  };

  return (
    <>
      <DispDropdown
        menu={getMenuDropdown()}
        label={t('user.myAccount')}
        className="w-48"
        modal={false}
      >
        {user ? (
          <Button variant="default">
            <User className="!w-5 !h-5" />
            <span>{user.name}</span>
          </Button>
        ) : (
          <Button size="icon" variant="default">
            <User className="!w-5 !h-5" />
          </Button>
        )}
      </DispDropdown>

      <AuthLogin open={openLogin} setOpen={setOpenLogin} />
    </>
  );
}

export function LayoutHeader() {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const t = useTranslations<NextIntl.Namespace<'Header'>>('Header');
  const { canGoBack, canGoForward, handleGoBack, handleGoForward } = useHistoryTracker();

  return (
    <>
      <section className="flex items-center justify-between gap-5 sticky top-2 pb-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger
            className="cursor-pointer opacity-80 w-9 h-9"
            variant="secondary"
            size="icon"
          />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer"
            disabled={!canGoBack}
            onClick={handleGoBack}
          >
            <ChevronLeftIcon className="!w-5 !h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer"
            disabled={!canGoForward}
            onClick={handleGoForward}
          >
            <ChevronRightIcon className="!w-5 !h-5" />
          </Button>
        </div>
        <InputSearch
          placeholder={t('search.placeholder')}
          onClick={() => {
            setOpenDialog(true);
          }}
          divClassName="bg-sidebar border-none rounded-full lg:w-96"
        />
        <UserButton />
      </section>

      <DialogSearchSong open={openDialog} setOpen={setOpenDialog} />
    </>
  );
}
