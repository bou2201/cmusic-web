import { NextIntl } from '~types/next-intl';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: NextIntl.LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations<NextIntl.Namespace<'GenrePage.metadata'>>({
    locale,
    namespace: 'GenrePage.metadata',
  });

  return {
    title: t('title'),
  };
}

export default function Page() {
  return <div>Genre</div>;
}
