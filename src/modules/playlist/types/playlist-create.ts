import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { NextIntl } from '~types/next-intl';

const usePlaylistCreate = () => {
  const t = useTranslations<NextIntl.Namespace<'Validation'>>('Validation');

  const schema = z.object({
    title: z.string({ message: t('common.required') }).min(1, { message: t('common.required') }),
    cover: z.any().optional(),
  });

  return schema;
};

type PlaylistCreateSchema = z.infer<ReturnType<typeof usePlaylistCreate>>;

export { usePlaylistCreate, type PlaylistCreateSchema };
