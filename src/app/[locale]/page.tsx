import { Locale } from '@/i18n/routing';
import type { Metadata } from 'next';
import type { NamespaceKeys } from 'next-intl';
import { getTranslations } from 'next-intl/server';

type HomePageParams = {
  params: Promise<{ locale: Locale }>;
};

export async function generateMetadata({ params }: HomePageParams): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations<NamespaceKeys<IntlMessages, 'HomePage.metadata'>>({
    locale,
    namespace: 'HomePage.metadata',
  });

  return {
    title: t('title'),
    description: t('description'),
  };
}

export default function HomePage() {
  return <>Home Page</>;
}
