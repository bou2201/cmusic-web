import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { NextIntl } from '~types/next-intl';

export const useArtistCouMntSchema = () => {
  const t = useTranslations<NextIntl.Namespace<'Validation'>>('Validation');

  const schema = z.object({
    name: z.string({ message: t('common.required') }).min(1, { message: t('common.required') }),
    bio: z.string().optional(),
    isPopular: z.boolean().default(false),
    avatar: z.any().optional(),
  });

  return schema;
};

export type UseArtistCouMntSchemaType = z.infer<ReturnType<typeof useArtistCouMntSchema>>;
