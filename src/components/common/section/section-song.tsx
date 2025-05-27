'use client';

import { Button, Skeleton } from '@/components/ui';
import { Routes } from '@/constants/routes';
import { Link, useRouter } from '@/i18n/navigation';
import { isCurrentlyPlaying, Song, useSongStore } from '@/modules/song';
import { getArtistName } from '@/utiils/function';
import { PlayIcon } from 'lucide-react';
import Image from 'next/image';
import { DispAnimationWave } from '../data-display/disp-animation';

export function SectionSong({ song, size }: { song: Song; size: 'small' | 'large' }) {
  const { track, setTrack, playlist, isPlaying, currentTrackIndex } = useSongStore(
    (state) => state,
  );

  const router = useRouter();

  if (size === 'small') {
    return (
      <div className="flex gap-3 p-3 rounded-md hover:bg-neutral-800 transition cursor-pointer">
        <div className="w-12 h-12 rounded-md shrink-0 relative">
          <Image
            src={song.cover?.url ?? '/images/song-default-white.png'}
            alt={song.title}
            height={100}
            width={100}
            className="object-cover w-full h-full rounded-md"
          />
          {isCurrentlyPlaying(song, { currentTrackIndex, isPlaying, playlist, track }) ? (
            <>
              <div className="absolute inset-0 bg-black/50"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <DispAnimationWave />
              </div>
            </>
          ) : null}
        </div>
        <div
          className="flex justify-between gap-5 items-center w-full overflow-hidden"
          onClick={() => {
            return router.push(`${Routes.Songs}/${song.id}`);
          }}
        >
          <div className="flex flex-col truncate">
            <Link
              href={`${Routes.Songs}/${song.id}`}
              className="font-semibold truncate hover:underline"
              title={song.title}
            >
              {song.title}
            </Link>
            <p
              className="text-neutral-400 text-sm truncate"
              title={getArtistName(song.artist, song.artists)}
            >
              {getArtistName(song.artist, song.artists)}
            </p>
          </div>
          <Button
            className="rounded-full bg-primary-pink hover:bg-primary-pink/80 p-3 drop-shadow-md transition w-8 h-8 shrink-0"
            onClick={(e) => {
              e.stopPropagation();
              setTrack(song);
            }}
            size="icon"
          >
            <PlayIcon className="stroke-white fill-white" />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col gap-2 p-4 rounded-md hover:bg-neutral-800 transition cursor-pointer w-auto">
      <div
        className="relative aspect-square w-full rounded-md overflow-hidden"
        onClick={() => {
          router.push(`${Routes.Songs}/${song.id}`);
        }}
      >
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
              setTrack(song);
            }}
            size="icon"
          >
            <PlayIcon className="!h-6 !w-6 stroke-white fill-white" />
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-1 truncate">
        <Link
          href={`${Routes.Songs}/${song.id}`}
          className="font-semibold truncate hover:underline"
          title={song.title}
        >
          {song.title}
        </Link>
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
