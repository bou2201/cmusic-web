'use client';

import { Routes } from '@/constants/routes';
import { useRouter } from '@/i18n/navigation';
import { AuthResponse, authService, useAuthStore } from '@/modules/auth';
import { useMutation } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { NextIntl } from '~types/next-intl';

export default function AuthCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);
  const t = useTranslations<NextIntl.Namespace<'Auth'>>('Auth');

  const { mutate } = useMutation({
    mutationFn: async ({ accessToken, refreshToken }: Omit<AuthResponse, 'user'>) => {
      const user = await authService.me(accessToken);

      if (!user) {
        throw new Error('Unauthorized');
      }

      return { user, accessToken, refreshToken };
    },
    onSuccess: ({ user, accessToken, refreshToken }: AuthResponse) => {
      setAuth(user, accessToken, refreshToken);
      toast(t('alert.loginSuccess'));

      router.replace(Routes.Discover);
    },
    onError: () => {
      toast.error(t('alert.loginFailed'));
      router.replace(Routes.Discover);
    },
  });

  useEffect(() => {
    const accessToken = searchParams.get('accessToken');
    const refreshToken = searchParams.get('refreshToken');

    if (!accessToken || !refreshToken) {
      toast.error(t('alert.loginFailed'));
      router.replace(Routes.Discover);
      return;
    }

    mutate({ accessToken, refreshToken });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-background">
      <Loader2Icon className="animate-spin w-16 h-16" />
    </div>
  );
}
