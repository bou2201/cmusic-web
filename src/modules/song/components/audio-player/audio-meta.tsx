'use client';

import { Routes } from '@/constants/routes';
import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { useSongStore } from '../../store';
import { getArtistName } from '@/utiils/function';
import { Artist } from '@/modules/artist';
import { Button } from '@/components/ui';
import { Heart } from 'lucide-react';

export function AudioMeta() {
  const track = useSongStore((state) => state.track);

  return (
    <div className="flex items-center gap-3 w-full">
      <div className="w-10 h-10 md:w-14 md:h-14 rounded-md overflow-hidden shrink-0">
        <Image
          src={track?.cover?.url ?? '/images/song-default-white.png'}
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
        <p className="text-sm text-zinc-400 truncate">
          {getArtistName(track?.artist as Artist, track?.artists ?? [])}
        </p>
      </div>
      <Button variant="ghost" size="icon" className="shrink-0">
        <Heart />
      </Button>
    </div>
  );
}
