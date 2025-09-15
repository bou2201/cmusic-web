import { useEmailSchema, usePasswordSchema } from '@/hooks/use-schema';
import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { NextIntl } from '~types/next-intl';

const useAuthLoginSchema = () => {
  const zEmail = useEmailSchema();
  const zPassword = usePasswordSchema();

  const schema = z.object({
    email: zEmail,
    password: zPassword,
  });

  return schema;
};

const useAuthRegisterSchema = () => {
  const t = useTranslations<NextIntl.Namespace<'Validation'>>('Validation');
  const zEmail = useEmailSchema();
  const zPassword = usePasswordSchema();

  const schema = z
    .object({
      email: zEmail,
      name: z.string({ message: t('common.required') }).min(1, { message: t('common.required') }),
      password: zPassword,
      confirmPassword: zPassword,
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('common.confirmPassword'),
      path: ['confirmPassword'],
    });

  return schema;
};

const useAuthChangePwSchema = () => {
  const t = useTranslations<NextIntl.Namespace<'Validation'>>('Validation');
  const zPassword = usePasswordSchema();

  const schema = z
    .object({
      currentPassword: zPassword,
      newPassword: zPassword,
      confirmPassword: zPassword,
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t('common.confirmPassword'),
      path: ['confirmPassword'],
    });

  return schema;
};

const useAuthForgotPwSchema = () => {
  const zEmail = useEmailSchema();

  const schema = z.object({
    email: zEmail,
  });

  return schema;
};

const useAuthResetPwSchema = () => {
  const t = useTranslations<NextIntl.Namespace<'Validation'>>('Validation');
  const zPassword = usePasswordSchema();

  const schema = z
    .object({
      token: z.string().uuid(),
      newPassword: zPassword,
      confirmNewPassword: zPassword,
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: t('common.confirmPassword'),
      path: ['confirmNewPassword'],
    });

  return schema;
};

type AuthReqLoginType = z.infer<ReturnType<typeof useAuthLoginSchema>>;
type AuthReqRegisterType = z.infer<ReturnType<typeof useAuthRegisterSchema>>;
type AuthReqChangePasswordType = z.infer<ReturnType<typeof useAuthChangePwSchema>>;
type AuthReqForgotPasswordType = z.infer<ReturnType<typeof useAuthForgotPwSchema>>;
type AuthReqResetPasswordType = z.infer<ReturnType<typeof useAuthResetPwSchema>>;

export {
  useAuthLoginSchema,
  useAuthRegisterSchema,
  useAuthChangePwSchema,
  useAuthForgotPwSchema,
  useAuthResetPwSchema,
};
export type {
  AuthReqLoginType,
  AuthReqRegisterType,
  AuthReqChangePasswordType,
  AuthReqForgotPasswordType,
  AuthReqResetPasswordType,
};
