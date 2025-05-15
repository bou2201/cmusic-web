'use client';

import { Artist } from '@/modules/artist';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import { NextIntl } from '~types/next-intl';

export function SectionArtist({ artist }: { artist: Artist }) {
  const t = useTranslations<NextIntl.Namespace<'Section'>>('Section');

  return (
    <div className="group flex flex-col items-center gap-4 p-4 bg-neutral-800/40 rounded-md hover:bg-neutral-800 transition cursor-pointer w-[200px]">
      <div className="relative aspect-square w-[150px] rounded-full overflow-hidden">
        <Image src={artist.avatar.url} alt={artist.name} fill className="object-cover" />
      </div>
      <div className="flex flex-col items-center gap-1">
        <h3 className="font-semibold truncate w-full text-center">{artist.name}</h3>
        <p className="text-neutral-400 text-sm">{t('artist.role')}</p>
      </div>
    </div>
  );
}
