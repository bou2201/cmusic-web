import { NextIntl } from '~types/next-intl';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { PageSearch } from '@/components/search';

export async function generateMetadata({ params }: NextIntl.LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations<NextIntl.Namespace<'SearchPage.metadata'>>({
    locale,
    namespace: 'SearchPage.metadata',
  });

  return {
    title: t('title'),
  };
}

export default async function Page() {
  return <PageSearch />;
}
