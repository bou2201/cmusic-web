'use client';

import { Button, Skeleton } from '@/components/ui';
import { Routes } from '@/constants/routes';
import { Link, useRouter } from '@/i18n/navigation';
import { DropdownHelper, isCurrentlyPlaying, Song, useSongStore } from '@/modules/song';
import { PauseIcon, PlayIcon } from 'lucide-react';
import Image from 'next/image';
import { DispAnimationWave } from '../data-display/disp-animation';
import { ViewRedirectArtist } from '@/modules/artist';
import { cn } from '@/lib/utils';
import { IMAGE_PLACEHOLDER } from '@/constants/link';

export function SectionSongInPlayListPlaying({ song }: { song: Song }) {
  const { track, playlist, isPlaying, currentTrackIndex } = useSongStore((state) => state);

  return (
    <div className="flex flex-col gap-3 p-2 rounded-md hover:bg-neutral-800 transition cursor-pointer">
      <div className="w-full h-auto rounded-md shrink-0 relative aspect-square">
        <Image
          src={song.cover?.url ?? IMAGE_PLACEHOLDER}
          alt={song.title}
          height={500}
          width={500}
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
      <div className="flex justify-between gap-3 items-center w-full overflow-hidden">
        <div className="flex flex-col truncate">
          <Link
            href={`${Routes.Songs}/${song.id}`}
            className="font-semibold text-sm truncate hover:underline"
            title={song.title}
          >
            {song.title}
          </Link>
          <div>
            <ViewRedirectArtist
              artist={song.artist}
              artists={song.artists}
              className="text-[13px]"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function SectionSongInPlaylist({ song, indexSong }: { song: Song; indexSong: number }) {
  const { setPlaylist, playlist, currentTrackIndex } = useSongStore((state) => state);

  return (
    <div
      className={cn(
        'flex gap-3 p-2 rounded-md hover:bg-neutral-800 transition cursor-pointer',
        currentTrackIndex === indexSong && 'bg-neutral-800',
      )}
    >
      <div className="w-11 h-11 rounded-md shrink-0 relative">
        <Image
          src={song.cover?.url ?? IMAGE_PLACEHOLDER}
          alt={song.title}
          height={100}
          width={100}
          className="object-cover w-full h-full rounded-md"
        />
      </div>
      <div className="flex justify-between gap-3 items-center w-full overflow-hidden">
        <div className="flex flex-col truncate">
          <Link
            href={`${Routes.Songs}/${song.id}`}
            className="font-semibold text-sm truncate hover:underline"
            title={song.title}
          >
            {song.title}
          </Link>
          <div>
            <ViewRedirectArtist artist={song.artist} artists={song.artists} className="text-xs" />
          </div>
        </div>
        <Button
          className="rounded-full w-8 h-8 shrink-0"
          onClick={(e) => {
            e.stopPropagation();
            setPlaylist(playlist, indexSong);
          }}
          size="icon"
          variant="ghost"
        >
          <PlayIcon className="fill-primary stroke-primary" />
        </Button>
      </div>
    </div>
  );
}

export function SectionSong({ song, size }: { song: Song; size: 'small' | 'large' }) {
  const { track, setTrack, playlist, isPlaying, currentTrackIndex, playAudio, pauseAudio } =
    useSongStore((state) => state);

  const router = useRouter();

  if (size === 'small') {
    return (
      <div className="group flex gap-3 p-2 rounded-md hover:bg-neutral-800 transition cursor-pointer relative">
        <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-md shrink-0 relative">
          <Image
            src={song.cover?.url ?? IMAGE_PLACEHOLDER}
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
          <div className="relative w-full">
            <div
              className="flex justify-between gap-5 items-center w-full overflow-hidden"
              onClick={() => router.push(`${Routes.Songs}/${song.id}`)}
            >
              <div className="flex flex-col truncate">
                <Link
                  href={`${Routes.Songs}/${song.id}`}
                  className="font-semibold truncate hover:underline"
                  title={song.title}
                >
                  {song.title}
                </Link>
                <div>
                  <ViewRedirectArtist artist={song.artist} artists={song.artists} />
                </div>
              </div>
            </div>

            {/* Action buttons (hover only) */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 flex gap-1 items-center opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition">
              <Button
                className="rounded-full bg-primary-pink hover:bg-primary-pink/80 p-3 drop-shadow-md transition w-8 h-8 shrink-0"
                onClick={(e) => {
                  e.stopPropagation();
                  const isCurrentSong = track?.id === song.id;

                  if (isPlaying && isCurrentSong) {
                    pauseAudio();
                  } else {
                    setTrack(song); // tự xử lý nhảy/replace playlist
                    playAudio(); // luôn play
                  }
                }}
                size="icon"
              >
                {isPlaying && track?.id === song.id ? (
                  <PauseIcon className="stroke-white fill-white" />
                ) : (
                  <PlayIcon className="stroke-white fill-white" />
                )}
              </Button>
              <DropdownHelper song={song} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="group flex flex-col gap-2 p-3 rounded-md hover:bg-neutral-800 transition cursor-pointer w-auto">
      <div
        className="relative aspect-square w-full rounded-md overflow-hidden"
        onClick={() => {
          router.push(`${Routes.Songs}/${song.id}`);
        }}
      >
        <Image
          src={song.cover?.url ?? IMAGE_PLACEHOLDER}
          alt={song.title}
          fill
          className="object-cover"
        />
        <div className="absolute bottom-2 right-2 flex gap-2 items-center opacity-0 group-hover:opacity-100 transition">
          <DropdownHelper song={song} />
          <Button
            className="rounded-full bg-primary-pink hover:bg-primary-pink p-3 drop-shadow-md hover:scale-110 transition w-12 h-12"
            onClick={(e) => {
              e.stopPropagation();
              const isCurrentSong = track?.id === song.id;

              if (isPlaying && isCurrentSong) {
                pauseAudio();
              } else {
                setTrack(song); // tự xử lý nhảy/replace playlist
                playAudio(); // luôn play
              }
            }}
            size="icon"
          >
            {isPlaying && track?.id === song.id ? (
              <PauseIcon className="!h-6 !w-6 stroke-white fill-white" />
            ) : (
              <PlayIcon className="!h-6 !w-6 stroke-white fill-white" />
            )}
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
        <div>
          <ViewRedirectArtist artist={song.artist} artists={song.artists} />
        </div>
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
