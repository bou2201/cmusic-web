import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { NextIntl } from '~types/next-intl';

const usePlaylistCou = () => {
  const t = useTranslations<NextIntl.Namespace<'Validation'>>('Validation');

  const schema = z.object({
    title: z.string({ message: t('common.required') }).min(1, { message: t('common.required') }),
    cover: z.any().optional(),
  });

  return schema;
};

type UsePlaylistCouSchema = z.infer<ReturnType<typeof usePlaylistCou>>;

export { usePlaylistCou, type UsePlaylistCouSchema };
