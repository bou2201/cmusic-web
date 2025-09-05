'use client';

import { useTranslations } from 'next-intl';
import { ApiReturn, DialogState } from '~types/common';
import { NextIntl } from '~types/next-intl';
import { AuthReqChangePasswordType, useAuthChangePwSchema } from '../types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Button, Form } from '@/components/ui';
import { DispDialog, InputTextPassword } from '@/components/common';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../service';
import { useAuthStore } from '../store';
import { toast } from 'sonner';
import { useRouter } from '@/i18n/navigation';
import { HttpStatusCode } from '@/constants/http-status-code';
import { Routes } from '@/constants/routes';

export function AuthChangePw({ open, setOpen }: DialogState) {
  const { clearAuth } = useAuthStore((state) => state);
  const t = useTranslations<NextIntl.Namespace<'Auth'>>('Auth');
  const loginSchema = useAuthChangePwSchema();
  const router = useRouter();

  const form = useForm<AuthReqChangePasswordType>({
    resolver: zodResolver(loginSchema),
    values: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const { mutate: execute, isPending } = useMutation({
    mutationFn: (payload: AuthReqChangePasswordType) => authService.changePassword(payload),
    onSuccess: () => {
      clearAuth();
      toast(t('alert.changePasswordSuccess'));
      setOpen(false);
      router.push(Routes.Discover);
      window.location.reload();
    },
    onError: (error: ApiReturn<any>) => {
      if (error.status === HttpStatusCode.Unauthorized) {
        toast.error(t('alert.changePasswordIncorrect'));
      }
      if (error.status === HttpStatusCode.InternalServerError) {
        toast.error(t('alert.systemError'));
      }
      toast.error(t('alert.changePasswordFailed'), {
        position: 'top-right',
      });
    },
  });

  useEffect(() => {
    return () => {
      form.reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DispDialog open={open} setOpen={setOpen} title={t('changePassword')}>
      <Form {...form}>
        <form
          id="form-login"
          onSubmit={form.handleSubmit((data) => {
            execute(data);
          })}
          className="mt-3"
        >
          <InputTextPassword<AuthReqChangePasswordType>
            name="currentPassword"
            label={t('currentPassword')}
            className="mb-4"
            inputProps={{
              placeholder: t('currentPassword'),
            }}
          />

          <InputTextPassword<AuthReqChangePasswordType>
            name="newPassword"
            label={t('newPassword')}
            className="mb-4"
            inputProps={{
              placeholder: t('newPassword'),
            }}
          />

          <InputTextPassword<AuthReqChangePasswordType>
            name="confirmPassword"
            label={t('confirmPassword')}
            inputProps={{
              placeholder: t('confirmPassword'),
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
              {t('changePassword')}
            </Button>
          </div>
        </form>
      </Form>
    </DispDialog>
  );
}
