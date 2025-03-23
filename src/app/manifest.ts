import { routing } from '@/i18n/routing';
import { NextIntl } from '~types/next-intl';
import type { MetadataRoute } from 'next';
import { getTranslations } from 'next-intl/server';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const t = await getTranslations<NextIntl.Namespace<'Manifest'>>({
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
    theme_color: '#ff6cd7',
  };
}
