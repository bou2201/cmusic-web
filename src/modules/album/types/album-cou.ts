import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { NextIntl } from '~types/next-intl';

export const useAlbumCouMntSchema = () => {
  const t = useTranslations<NextIntl.Namespace<'Validation'>>('Validation');

  const schema = z.object({
    title: z.string({ message: t('common.required') }).min(1, { message: t('common.required') }),
    description: z.string().optional(),
    cover: z.any().optional(),
    releaseDate: z.string().optional(),
    artistId: z.string({ message: t('common.required') }).min(1, { message: t('common.required') }),
    isFeatured: z.boolean().default(false).optional(),
    songIds: z.array(z.string()).default([]).optional(),
    isPublic: z.boolean().default(true).optional(),
  });

  return schema;
};

export type UseAlbumCouMntSchemaType = z.infer<ReturnType<typeof useAlbumCouMntSchema>>;
