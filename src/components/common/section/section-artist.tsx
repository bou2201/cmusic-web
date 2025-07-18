'use client';

import { Skeleton } from '@/components/ui';
import { Routes } from '@/constants/routes';
import { Link, useRouter } from '@/i18n/navigation';
import { Artist } from '@/modules/artist';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { NextIntl } from '~types/next-intl';

export function SectionArtist({ artist, size }: { artist: Artist; size: 'small' | 'large' }) {
  const router = useRouter();
  const t = useTranslations<NextIntl.Namespace<'Section'>>('Section');

  return size === 'large' ? (
    <div
      className="group flex flex-col items-center gap-4 p-4 rounded-md hover:bg-neutral-800 transition cursor-pointer w-auto"
      onClick={() => {
        router.push(`${Routes.Artists}/${artist.id}`);
      }}
    >
      <div className="relative aspect-square w-full rounded-full overflow-hidden">
        <Image src={artist.avatar.url} alt={artist.name} fill className="object-cover" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <Link
          href={`${Routes.Artists}/${artist.id}`}
          className="font-semibold truncate w-full text-center hover:underline"
        >
          {artist.name}
        </Link>
        <p className="text-neutral-400 text-sm">{t('artist.role')}</p>
      </div>
    </div>
  ) : (
    <div
      className="flex items-center gap-4 p-3 rounded-md hover:bg-neutral-800 transition cursor-pointer w-auto"
      onClick={() => {
        router.push(`${Routes.Artists}/${artist.id}`);
      }}
    >
      <div className="relative aspect-square w-16 h-16 rounded-full overflow-hidden">
        <Image src={artist.avatar.url} alt={artist.name} fill className="object-cover" />
      </div>
      <div>
        <p className="text-sm font-semibold opacity-70 mb-1">{t('artist.role')}</p>
        <Link
          href={`${Routes.Artists}/${artist.id}`}
          className="font-semibold truncate w-full text-center hover:underline"
        >
          {artist.name}
        </Link>
      </div>
    </div>
  );
}

export function SectionArtistSkeleton({ quantity }: { quantity: number }) {
  return Array.from({ length: quantity }).map((_, i) => (
    <div className="group flex flex-col items-center gap-4 p-4" key={i}>
      <Skeleton className="md:w-32 md:h-32 lg:w-40 lg:h-40 rounded-full" />
      <Skeleton className="md:w-16 lg:w-20 h-6" />
      <Skeleton className="md:w-22 lg:w-28 h-5" />
    </div>
  ));
}
