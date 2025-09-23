'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthRegisterSchema, type AuthReqRegisterType } from '../types';
import { DispDialog, InputText, InputTextPassword } from '@/components/common';
import { ApiReturn, DialogState } from '~types/common';
import { Button, Form } from '@/components/ui';
import { NextIntl } from '~types/next-intl';
import { useTranslations } from 'next-intl';
import { authService } from '../service';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuthStore } from '../store';
import { HttpStatusCode } from '@/constants/http-status-code';
import { useEffect } from 'react';

export function AuthRegister({ open, setOpen }: DialogState) {
  const setAuth = useAuthStore((state) => state.setAuth);
  const t = useTranslations<NextIntl.Namespace<'Auth'>>('Auth');
  const registerSchema = useAuthRegisterSchema();

  const form = useForm<AuthReqRegisterType>({
    resolver: zodResolver(registerSchema),
    values: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const { mutate: execute, isPending } = useMutation({
    mutationFn: (payload: AuthReqRegisterType) => authService.register(payload),
    onSuccess: (data) => {
      if (data) {
        setAuth(data.user, data.accessToken, data.refreshToken);
      }
      toast(t('alert.registerSuccess'));
      setOpen(false);
    },
    onError: (error: ApiReturn<any>) => {
      if (error.status === HttpStatusCode.Conflict) {
        toast.error(t('alert.registerFailedEmailExists'));
      }
      if (error.status === HttpStatusCode.InternalServerError) {
        toast.error(t('alert.systemError'));
      }
      toast.error(t('alert.registerFailed'));
    },
  });

  useEffect(() => {
    return () => {
      form.reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DispDialog open={open} setOpen={setOpen} title={t('submitRegister')}>
      <Form {...form}>
        <form
          id="form-register"
          onSubmit={form.handleSubmit((data) => {
            execute(data);
          })}
          className="mt-3"
        >
          <InputText<AuthReqRegisterType>
            name="name"
            label={t('name')}
            className="mb-4"
            inputProps={{
              placeholder: t('name'),
            }}
          />
          <InputText<AuthReqRegisterType>
            name="email"
            label={t('email')}
            className="mb-4"
            inputProps={{
              placeholder: t('email'),
            }}
          />
          <InputTextPassword<AuthReqRegisterType>
            name="password"
            label={t('password')}
            className="mb-4"
            inputProps={{
              placeholder: t('password'),
            }}
          />
          <InputTextPassword<AuthReqRegisterType>
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
              {t('submitRegister')}
            </Button>
          </div>
        </form>
      </Form>
    </DispDialog>
  );
}
