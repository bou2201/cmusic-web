import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { NextIntl } from '~types/next-intl';

export const useUserChangeStatusSchema = () => {
  const t = useTranslations<NextIntl.Namespace<'Validation'>>('Validation');

  const schema = z.object({
    userId: z.string({ message: t('common.required') }).min(1, { message: t('common.required') }),
    isBlocked: z.boolean().default(false),
    adminId: z.string({ message: t('common.required') }).min(1, { message: t('common.required') }),
    description: z
      .string({ message: t('common.required') })
      .min(1, { message: t('common.required') }),
  });

  return schema;
};

export type UserChangeStatusSchemaType = z.infer<ReturnType<typeof useUserChangeStatusSchema>>;
