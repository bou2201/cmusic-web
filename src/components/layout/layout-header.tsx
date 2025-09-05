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
import { AuthChangePw, AuthLogin, AuthRegister, useAuthStore } from '@/modules/auth';
import { useMutation } from '@tanstack/react-query';
import { authService } from '@/modules/auth/service';
import { toast } from 'sonner';
import { LayoutSearchDialog } from './layout-dialog';
import { useRouter } from '@/i18n/navigation';
import { Routes } from '@/constants/routes';

function UserButton() {
  const [openLogin, setOpenLogin] = useState<boolean>(false);
  const [openRegister, setOpenRegister] = useState<boolean>(false);
  const [openChangePassword, setOpenChangePassword] = useState<boolean>(false);

  const { user, isAuthenticated, clearAuth } = useAuthStore((state) => state);
  const router = useRouter();
  const t = useTranslations<NextIntl.Namespace<'Header'>>('Header');
  const tAuth = useTranslations<NextIntl.Namespace<'Auth'>>('Auth');

  const { mutate: exucuteLogout } = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearAuth();
      toast(tAuth('alert.logoutSuccess'));
      router.push(Routes.Discover);
      window.location.reload();
    },
    onError: () => {
      toast.error(tAuth('alert.logoutFailed'));
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
          onClick: () => {
            setOpenChangePassword(true);
          },
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
        onClick: () => {
          setOpenRegister(true);
        },
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
          <Button variant="ghost" className="!h-10">
            <User className="!w-5 !h-5" />
            <span>{user.name}</span>
          </Button>
        ) : (
          <Button size="icon" variant="ghost" className="!h-10 !w-10">
            <User className="!w-5 !h-5" />
          </Button>
        )}
      </DispDropdown>

      {openLogin ? <AuthLogin open={openLogin} setOpen={setOpenLogin} /> : null}
      {openRegister ? <AuthRegister open={openRegister} setOpen={setOpenRegister} /> : null}
      {openChangePassword ? (
        <AuthChangePw open={openChangePassword} setOpen={setOpenChangePassword} />
      ) : null}
    </>
  );
}

export function LayoutHeader({ type }: { type: 'web' | 'dashboard' }) {
  const [openDialog, setOpenDialog] = useState<boolean>(false);

  const t = useTranslations<NextIntl.Namespace<'Header'>>('Header');
  const { canGoBack, canGoForward, handleGoBack, handleGoForward } = useHistoryTracker();

  return (
    <>
      <section className="flex items-center justify-between gap-5 sticky top-0 pb-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger
            className="cursor-pointer opacity-80 w-10 h-10"
            variant="secondary"
            size="icon"
          />
          <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-6" />
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer w-10 h-10"
            disabled={!canGoBack}
            onClick={handleGoBack}
          >
            <ChevronLeftIcon className="!w-6 !h-6" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer w-10 h-10"
            disabled={!canGoForward}
            onClick={handleGoForward}
          >
            <ChevronRightIcon className="!w-6 !h-6" />
          </Button>
        </div>
        {type === 'web' ? (
          <InputSearch
            placeholder={t('search.placeholder')}
            onClick={() => {
              setOpenDialog(true);
            }}
            divClassName="bg-sidebar border-none rounded-full lg:w-96 h-10"
          />
        ) : null}
        <UserButton />
      </section>

      <LayoutSearchDialog open={openDialog} setOpen={setOpenDialog} />
    </>
  );
}
