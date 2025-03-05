import { routing } from '@/i18n/routing';
import type { MetadataRoute } from 'next';
import type { NamespaceKeys } from 'next-intl';
import { getTranslations } from 'next-intl/server';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const t = await getTranslations<NamespaceKeys<IntlMessages, 'Manifest'>>({
    locale: routing.defaultLocale,
    namespace: 'Manifest',
  });

  return {
    name: t('name'),
    short_name: t('short_name'),
    description: t('description'),
    start_url: '/',
    display: 'standalone',
    background_color: '#0b0809',
  };
}
