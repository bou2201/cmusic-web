import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Locale, routing } from '@/i18n/routing';
import { geistMono, geistSans, quickSand } from '../font';
import { ProgressProvider, ThemeProvider, UiProvider } from '@/providers';
import { SidebarProvider } from '@/components/ui';
import Favicon from '~public/favicon.ico';
import { cookies } from 'next/headers';
import type { Metadata, Viewport } from 'next';

import '@/styles/globals.css';
import { MainLayout } from '@/components/layout';

export const metadata: Metadata = {
  icons: {
    icon: {
      url: Favicon.src,
      type: 'image/png',
    },
    shortcut: { url: Favicon.src, type: 'image/png' },
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  height: 'device-height',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: Locale }>;
}) {
  // Persisted state 'sidebar_state'
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true';

  // Ensure that the incoming `locale` is valid
  const { locale } = await params;
  if (!routing.locales.includes(locale)) {
    notFound();
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={`${quickSand.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            themes={['dark']}
            disableTransitionOnChange
          >
            <UiProvider>
              <SidebarProvider defaultOpen={defaultOpen}>
                <ProgressProvider>
                  <MainLayout>{children}</MainLayout>
                </ProgressProvider>
              </SidebarProvider>
            </UiProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
