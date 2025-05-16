'use client';

import { Button, Skeleton } from '@/components/ui';
import { Song } from '@/modules/song';
import { getArtistName } from '@/utiils/function';
import { PlayIcon } from 'lucide-react';
import Image from 'next/image';

export function SectionSong({ song }: { song: Song }) {
  return (
    <div className="group flex flex-col gap-2 p-4 rounded-md hover:bg-neutral-800 transition cursor-pointer w-auto">
      <div className="relative aspect-square w-full rounded-md overflow-hidden">
        <Image
          src={song.cover?.url ?? '/images/song-default-white.png'}
          alt={song.title}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition">
          <Button
            className="rounded-full bg-primary-pink hover:bg-primary-pink p-3 drop-shadow-md hover:scale-110 transition w-12 h-12"
            onClick={(e) => {
              e.stopPropagation();
            }}
            size="icon"
          >
            <PlayIcon className="!h-6 !w-6 stroke-white fill-white" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-1 truncate">
        <h3 className="font-semibold truncate" title={song.title}>
          {song.title}
        </h3>
        <p
          className="text-neutral-400 text-sm truncate"
          title={getArtistName(song.artist, song.artists)}
        >
          {getArtistName(song.artist, song.artists)}
        </p>
      </div>
    </div>
  );
}

export function SectionSongSkeleton({ quantity }: { quantity: number }) {
  return Array.from({ length: quantity }).map((_, i) => (
    <div className="group flex flex-col gap-2 p-4" key={i}>
      <Skeleton className="md:w-44 md:h-44 lg:w-60 lg:h-60 rounded-md" />
      <Skeleton className="md:w-20 lg:w-24 h-6" />
      <Skeleton className="md:w-28 lg:w-36 h-5" />
    </div>
  ));
}
