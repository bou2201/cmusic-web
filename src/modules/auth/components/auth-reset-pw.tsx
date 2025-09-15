'use client';

import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { NextIntl } from '~types/next-intl';
import { AuthReqResetPasswordType, useAuthResetPwSchema } from '../types';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Alert, AlertDescription, AlertTitle, Button, Form } from '@/components/ui';
import { useMutation } from '@tanstack/react-query';
import { authService } from '../service';
import { toast } from 'sonner';
import { ApiReturn } from '~types/common';
import { HttpStatusCode } from '@/constants/http-status-code';
import { useState } from 'react';
import { InputTextPassword } from '@/components/common';
import { useRouter } from '@/i18n/navigation';
import { Routes } from '@/constants/routes';
import { ArrowLeft, Check, Terminal } from 'lucide-react';

export function AuthResetPw() {
  const [hadReset, setHadReset] = useState<boolean>(false);

  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const t = useTranslations<NextIntl.Namespace<'Auth'>>('Auth');
  const resetPwSchema = useAuthResetPwSchema();
  const router = useRouter();

  const form = useForm<AuthReqResetPasswordType>({
    resolver: zodResolver(resetPwSchema),
    values: {
      token: token || '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const { mutate: execute, isPending } = useMutation({
    mutationFn: (payload: AuthReqResetPasswordType) => authService.resetPassword(payload),
    onSuccess: () => {
      setHadReset(true);

      toast(t('alert.resetPasswordSuccess'));
    },
    onError: (error: ApiReturn<any>) => {
      if (error.status === HttpStatusCode.InternalServerError) {
        toast.error(t('alert.systemError'));
      }
    },
  });

  return (
    <section className="flex justify-center items-center h-screen w-full">
      <div className="max-w-lg w-full bg-primary-foreground px-6 py-6 rounded-md shadow-2xl">
        <h1 className="text-2xl font-semibold mb-2">{t('resetPassword')}</h1>
        <p className="mb-4 opacity-80">{t('resetPasswordDescription')}</p>

        <Form {...form}>
          <form
            id="form-reset-password"
            onSubmit={form.handleSubmit((data) => {
              execute(data);
            })}
            className="mt-10"
          >
            {hadReset ? (
              <>
                <Alert variant="default">
                  <Check />
                  <AlertTitle>{t('alert.success')}</AlertTitle>
                  <AlertDescription>{t('resetPasswordSuccessDecs')}</AlertDescription>
                </Alert>
                <Button
                  className="w-full mt-10"
                  type="button"
                  variant="ghost"
                  isLoading={isPending}
                  onClick={() => router.push(Routes.Discover)}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />

                  {t('backToHome')}
                </Button>
              </>
            ) : (
              <>
                <InputTextPassword<AuthReqResetPasswordType>
                  name="newPassword"
                  label={t('newPassword')}
                  className="mb-5"
                  inputProps={{
                    placeholder: t('newPassword'),
                  }}
                />

                <InputTextPassword<AuthReqResetPasswordType>
                  name="confirmNewPassword"
                  label={t('confirmPassword')}
                  inputProps={{
                    placeholder: t('confirmPassword'),
                  }}
                />
                <Button
                  className="w-full mt-10"
                  type="submit"
                  variant="default"
                  isLoading={isPending}
                >
                  {t('submit')}
                </Button>
              </>
            )}
          </form>
        </Form>
      </div>
    </section>
  );
}
