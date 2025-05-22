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
    background_color: 'oklch(0.141 0.005 285.823)',
    theme_color: 'oklch(0.74 0.17 20.56)',
  };
}
