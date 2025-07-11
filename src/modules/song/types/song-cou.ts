import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { NextIntl } from '~types/next-intl';

export const useSongCouMntSchema = () => {
  const t = useTranslations<NextIntl.Namespace<'Validation'>>('Validation');

  const schema = z.object({
    title: z.string({ message: t('common.required') }).min(1, { message: t('common.required') }),
    cover: z.any().nullable(),
    duration: z.coerce.number(),
    audioUrl: z.string({ message: t('common.required') }),
    audioPublicId: z.string(),
    artistId: z.string({ message: t('common.required') }).min(1, { message: t('common.required') }),
    lyrics: z.string().optional(),
    featuredArtistIds: z.array(z.string()).default([]),
    genreIds: z
      .array(z.string())
      .min(1, { message: t('common.required') })
      .default([]),
    albumId: z.string().nullable(),
    isExplicit: z.boolean().default(false),
    isPublic: z.boolean().default(true),
  });

  return schema;
};

export type UseSongCouMntSchemaType = z.infer<ReturnType<typeof useSongCouMntSchema>>;
