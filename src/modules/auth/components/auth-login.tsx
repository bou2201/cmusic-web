'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthLoginSchema, type AuthReqLoginType } from '../types';
import { DisDialog, InputText, InputTextPassword } from '@/components/common';
import { ApiReturn, DialogState } from '~types/common';
import { Button, Form } from '@/components/ui';
import { NextIntl } from '~types/next-intl';
import { useTranslations } from 'next-intl';
import { authService } from '../service';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '../store';
import { HttpStatusCode } from '@/constants/http-status-code';

export function AuthLogin({ open, setOpen }: DialogState) {
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
      toast(t('alert.loginSuccess'), { position: 'top-right' });
      setOpen(false);
    },
    onError: (error: ApiReturn<any>) => {
      if (error.status === HttpStatusCode.Unauthorized) {
        toast.error(t('alert.loginUnauthorized'));
      }
      if (error.status === HttpStatusCode.InternalServerError) {
        toast.error(t('alert.systemError'));
      }
      toast.error(t('alert.loginFailed'), {
        position: 'top-right',
      });
    },
  });

  return (
    <DisDialog open={open} setOpen={setOpen} title={t('submitLogin')}>
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

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setOpen(false);
              }}
            >
              {t('cancel')}
            </Button>
            <Button type="submit" variant="default" isLoading={isPending}>
              {t('submitLogin')}
            </Button>
          </div>
        </form>
      </Form>
    </DisDialog>
  );
}
