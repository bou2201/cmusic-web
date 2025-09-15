'use client';

import { DispDialog, InputText } from '@/components/common';
import { Button, Form } from '@/components/ui';
import { useTranslations } from 'next-intl';
import { ApiReturn, DialogState } from '~types/common';
import { NextIntl } from '~types/next-intl';
import { AuthReqForgotPasswordType, useAuthForgotPwSchema } from '../types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../service';
import { toast } from 'sonner';
import { HttpStatusCode } from '@/constants/http-status-code';
import { useEffect } from 'react';

export function AuthForgotPw({ open, setOpen }: DialogState) {
  const t = useTranslations<NextIntl.Namespace<'Auth'>>('Auth');
  const forgotPwSchema = useAuthForgotPwSchema();

  const form = useForm<AuthReqForgotPasswordType>({
    resolver: zodResolver(forgotPwSchema),
    values: {
      email: '',
    },
  });

  const { mutate: execute, isPending } = useMutation({
    mutationFn: (payload: AuthReqForgotPasswordType) => authService.forgotPassword(payload.email),
    onSuccess: () => {
      toast(t('alert.forgotPasswordSuccess'));
    },
    onError: (error: ApiReturn<any>) => {
      if (error.status === HttpStatusCode.BadRequest) {
        toast.error(t('alert.emailNoExist'));
      }
      if (error.status === HttpStatusCode.InternalServerError) {
        toast.error(t('alert.systemError'));
      }
    },
  });

  useEffect(() => {
    return () => {
      form.reset();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DispDialog open={open} setOpen={setOpen} title={t('forgotPassword')}>
      <Form {...form}>
        <form
          id="form-forgot-password"
          onSubmit={form.handleSubmit((data) => {
            execute(data);
          })}
          className="mt-3"
        >
          <InputText<AuthReqForgotPasswordType>
            name="email"
            label={t('email')}
            inputProps={{
              placeholder: t('email'),
            }}
            description={t('forgotPasswordDescription')}
          />

          <Button className="w-full mt-10" type="submit" variant="default" isLoading={isPending}>
            {t('submit')}
          </Button>
        </form>
      </Form>
    </DispDialog>
  );
}
