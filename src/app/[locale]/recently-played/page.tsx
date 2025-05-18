import { NextIntl } from '~types/next-intl';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { PageRecently } from '@/modules/song';

export async function generateMetadata({ params }: NextIntl.LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations<NextIntl.Namespace<'RecentlyPlayedPage.metadata'>>({
    locale,
    namespace: 'RecentlyPlayedPage.metadata',
  });

  return {
    title: t('title'),
  };
}

export default function Page() {
  return <PageRecently />;
}
