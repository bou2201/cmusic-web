import { NextIntl } from '~types/next-intl';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

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

export default function Page({ params }: { params: { q?: string } }) {
  return <div>Songs {params?.q}</div>;
}
