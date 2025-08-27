'use client';

import { Routes } from '@/constants/routes';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useSongStore } from '../../store';
import { Artist, ViewRedirectArtist } from '@/modules/artist';
import { BtnLikeSong } from './btn-like-song';
import { IMAGE_PLACEHOLDER } from '@/constants/link';

export function AudioMeta() {
  const track = useSongStore((state) => state.track);

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="w-10 h-10 md:w-14 md:h-14 rounded-md overflow-hidden shrink-0">
        <Image
          src={track?.cover?.url ?? IMAGE_PLACEHOLDER}
          alt="cover"
          className="w-full h-full object-cover"
          width={120}
          height={120}
        />
      </div>
      <div className="truncate max-md:max-w-3xs max-sm:max-w-40">
        <Link
          href={`${Routes.Songs}/${track?.id}`}
          className="font-semibold hover:underline cursor-pointer truncate"
          title={track?.title}
        >
          {track?.title}
        </Link>
        <div>
          <ViewRedirectArtist artist={track?.artist as Artist} artists={track?.artists ?? []} />
        </div>
      </div>

      <BtnLikeSong songId={track?.id ?? ''} />
    </div>
  );
}
