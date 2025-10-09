'use client';

import { IMAGE_PLACEHOLDER } from '@/constants/link';
import Image from 'next/image';

type SectionDetailsProps = {
  children: React.ReactNode;
  headerContent: React.ReactNode;
  headerImage: {
    url: string;
    alt: string;
  };
  type: 'song' | 'artist';
};
export function SectionDetails({
  children,
  headerContent,
  headerImage,
  type,
}: SectionDetailsProps) {
  return (
    <section className="h-full rounded-xl bg-sidebar overflow-x-hidden overflow-y-auto">
      <div className="w-full h-72 relative">
        <div
          className="absolute inset-0 -bottom-16 z-0"
          style={{
            backgroundImage: `url(${headerImage.url ?? IMAGE_PLACEHOLDER})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(40px)',
            opacity: 0.8,
          }}
        />
        <div
          className="absolute inset-0 top-[100%] -bottom-60 z-0"
          style={{
            background: 'linear-gradient(to bottom, oklch(0.141 0.005 285.823), oklch(0.1822 0 0))',
            opacity: 0.1,
          }}
        />

        <div className="relative py-5 px-7 z-10 flex max-sm:flex-col items-end max-sm:gap-3 max-sm:items-start gap-8 -bottom-6">
          <div className="max-sm:block hidden w-20 h-20">
            <Image
              width={1000}
              height={1000}
              alt={headerImage.alt}
              src={headerImage.url ?? IMAGE_PLACEHOLDER}
              className={`w-full h-full object-cover ${type === 'artist' ? 'rounded-full' : 'rounded-xl'}`}
              unoptimized
            />
          </div>
          <div className={`w-[216px] h-[216px] ${type === 'artist' ? 'rounded-full' : 'aspect-square'} shadow-2xl max-sm:hidden`}>
            <Image
              width={1000}
              height={1000}
              alt={headerImage.alt}
              src={headerImage.url ?? IMAGE_PLACEHOLDER}
              className={`w-full h-full object-cover ${type === 'artist' ? 'rounded-full' : 'rounded-xl'}`}
              unoptimized
            />
          </div>
          {headerContent}
        </div>
      </div>

      <div className="p-7 relative z-10">{children}</div>
    </section>
  );
}
