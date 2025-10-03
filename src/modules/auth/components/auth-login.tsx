'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthLoginSchema, type AuthReqLoginType } from '../types';
import { DispDialog, InputText, InputTextPassword } from '@/components/common';
import { ApiReturn, DialogState } from '~types/common';
import { Button, Form, Separator } from '@/components/ui';
import { NextIntl } from '~types/next-intl';
import { useTranslations } from 'next-intl';
import { authService } from '../service';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '../store';
import { HttpStatusCode } from '@/constants/http-status-code';
import { useEffect, useState } from 'react';
import { AuthForgotPw } from './auth-forgot-pw';
import { GoogleIcon } from '@/lib/icons';

export function AuthLogin({ open, setOpen }: DialogState) {
  const [openForgot, setOpenForgot] = useState<boolean>(false);

  const setAuth = useAuthStore((state) => state.setAuth);
  const t = useTranslations<NextIntl.Namespace<'Auth'>>('Auth');
  const loginSchema = useAuthLoginSchema();

  const form = useForm<AuthReqLoginType>({
    resolver: zodResolver(loginSchema),
    values: {
      email: '',
      password: '',
    },
  });

  const { mutate: execute, isPending } = useMutation({
    mutationFn: (payload: AuthReqLoginType) => authService.login(payload),
    onSuccess: (data) => {
      if (data) {
        setAuth(data.user, data.accessToken, data.refreshToken);
      }
      toast(t('alert.loginSuccess'));
      setOpen(false);
    },
    onError: (error: ApiReturn<any>) => {
      if (error.status === HttpStatusCode.Unauthorized) {
        toast.error(t('alert.loginUnauthorized'));
        return;
      }
      if (error.status === HttpStatusCode.InternalServerError) {
        toast.error(t('alert.systemError'));
        return;
      }
      toast.error(t('alert.loginFailed'));
    },
  });

  useEffect(() => {
    return () => {
      form.reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <DispDialog open={open} setOpen={setOpen} title={t('submitLogin')} className="sm:max-w-96">
        <Form {...form}>
          <form
            id="form-login"
            onSubmit={form.handleSubmit((data) => {
              execute(data);
            })}
            className="mt-3"
          >
            <InputText<AuthReqLoginType>
              name="email"
              label={t('email')}
              className="mb-4"
              inputProps={{
                placeholder: t('email'),
              }}
            />
            <InputTextPassword<AuthReqLoginType>
              name="password"
              label={t('password')}
              inputProps={{
                placeholder: t('password'),
              }}
            />

            <p
              className="text-right mt-5 text-sm opacity-80 hover:underline cursor-pointer"
              onClick={() => setOpenForgot(true)}
            >
              {t('forgotPassword')}
            </p>

            <Button
              type="submit"
              variant="default"
              isLoading={isPending}
              className="mt-7 w-full font-semibold"
            >
              {t('submitLogin')}
            </Button>

            <div className="flex justify-between items-center gap-10 my-7">
              <Separator className="h-px flex-1 bg-border" />
              <span className="text-sm opacity-80">{t('or')}</span>
              <Separator className="h-px flex-1 bg-border" />
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              size="lg"
              onClick={(e) => {
                e.stopPropagation();
                e.preventDefault();

                window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
              }}
            >
              <GoogleIcon className="mr-2" />
              <>{t('signinWithGoogle')}</>
            </Button>
          </form>
        </Form>
      </DispDialog>

      {openForgot && <AuthForgotPw open={openForgot} setOpen={setOpenForgot} />}
    </>
  );
}
