import { NextIntl } from '~types/next-intl';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata({ params }: NextIntl.LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations<NextIntl.Namespace<'HomePage.metadata'>>({
    locale,
    namespace: 'HomePage.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function HomePage() {
  return <h1 className="text-[120px]">Songs</h1>;
}
