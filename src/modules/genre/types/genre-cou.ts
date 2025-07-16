import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { NextIntl } from '~types/next-intl';

export const useGenreCouMntSchema = () => {
  const t = useTranslations<NextIntl.Namespace<'Validation'>>('Validation');

  const schema = z.object({
    name: z.string({ message: t('common.required') }).min(1, { message: t('common.required') }),
    description: z.string().optional(),
    isFeatured: z.boolean().default(false),
  });

  return schema;
};

export type UseGenreCouMntSchemaType = z.infer<ReturnType<typeof useGenreCouMntSchema>>;
