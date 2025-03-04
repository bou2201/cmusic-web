import type { Viewport } from 'next';
import { ProgressProvider, ThemeProvider, UiProvider } from '@/providers';
import { geistMono, geistSans, quickSand } from './font';

import '@/styles/globals.css';

export const viewport: Viewport = {
  width: 'device-width',
  height: 'device-height',
  initialScale: 1,
  minimumScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${quickSand.className} ${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          themes={['dark']}
          disableTransitionOnChange
        >
          <UiProvider>
            <ProgressProvider>{children}</ProgressProvider>
          </UiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
