import { Routes } from '@/constants/routes';
import { redirect } from '@/i18n/navigation';
import { Locale, routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';

export default async function Page({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  return redirect({ href: Routes.AdminSongs, locale });
}
