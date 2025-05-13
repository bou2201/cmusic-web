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

const useAuthChangePasswordSchema = () => {
  const t = useTranslations<NextIntl.Namespace<'Validation'>>('Validation');
  const zPassword = usePasswordSchema();

  const schema = z
    .object({
      currentPassword: zPassword,
      newPassword: zPassword,
    })
    .refine((data) => data.currentPassword === data.newPassword, {
      message: t('common.confirmPassword'),
      path: ['newPassword'],
    });

  return schema;
};

const useAuthResetPasswordSchema = () => {
  const zPassword = usePasswordSchema();

  const schema = z.object({
    token: z.string().uuid(),
    newPassword: zPassword,
  });

  return schema;
};

type AuthReqLoginType = z.infer<ReturnType<typeof useAuthLoginSchema>>;
type AuthReqRegisterType = z.infer<ReturnType<typeof useAuthRegisterSchema>>;
type AuthReqChangePasswordType = z.infer<ReturnType<typeof useAuthChangePasswordSchema>>;
type AuthReqResetPasswordType = z.infer<ReturnType<typeof useAuthResetPasswordSchema>>;

export {
  useAuthLoginSchema,
  useAuthRegisterSchema,
  useAuthChangePasswordSchema,
  useAuthResetPasswordSchema,
};
export type {
  AuthReqLoginType,
  AuthReqRegisterType,
  AuthReqChangePasswordType,
  AuthReqResetPasswordType,
};
