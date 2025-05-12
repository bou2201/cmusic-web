import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { NextIntl } from '~types/next-intl';

const useAuthLoginSchema = () => {
  const t = useTranslations<NextIntl.Namespace<'Validation'>>('Validation');

  const schema = z
    .object({
      email: z
        .string({ message: t('common.required') })
        .min(1, { message: t('common.required') })
        .email(t('common.email')),
      password: z
        .string({ message: t('common.required') })
        .min(6, { message: t('common.minLength', { 0: 6 }) }),
      confirmPassword: z
        .string({ message: t('common.required') })
        .min(6, { message: t('common.minLength', { 0: 6 }) }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t('common.confirmPassword'),
      path: ['confirmPassword'],
    });

  return schema;
};

const useAuthRegisterSchema = () => {
  const t = useTranslations<NextIntl.Namespace<'Validation'>>('Validation');

  const schema = z.object({
    email: z
      .string({ message: t('common.required') })
      .min(1, { message: t('common.required') })
      .email(t('common.email')),
    password: z
      .string({ message: t('common.required') })
      .min(6, { message: t('common.minLength', { 0: 6 }) }),
    name: z.string({ message: t('common.required') }).min(1, { message: t('common.required') }),
  });

  return schema;
};

type AuthReqLoginType = z.infer<ReturnType<typeof useAuthLoginSchema>>;
type AuthReqRegisterType = z.infer<ReturnType<typeof useAuthRegisterSchema>>;

export { useAuthLoginSchema, useAuthRegisterSchema };
export type { AuthReqLoginType, AuthReqRegisterType };
