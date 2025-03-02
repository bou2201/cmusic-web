import { Geist, Geist_Mono } from 'next/font/google';
import localFont from 'next/font/local';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const quickSand = localFont({
  variable: '--font-quicksand',
  src: [
    {
      path: '../../assets/fonts/Quicksand-Light.ttf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/Quicksand-Regular.ttf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/Quicksand-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/Quicksand-SemiBold.ttf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../../assets/fonts/Quicksand-Bold.ttf',
      weight: '700',
      style: 'normal',
    },
  ],
});

export { geistSans, geistMono, quickSand };
