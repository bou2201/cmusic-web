'use client';

import { IMAGE_PLACEHOLDER } from '@/constants/link';
import { usePlaylistDetails } from '../hooks';
import Image from 'next/image';
import { DispAlertDialog, DispAvatar, DispTable } from '@/components/common';
import {
  DropdownHelper,
  formatDurationSum,
  formatNumber,
  getShortName,
  isCurrentlyPlaying,
  Song,
  useSongStore,
} from '@/modules/song';
import { Link } from '@/i18n/navigation';
import { Routes } from '@/constants/routes';
import { useAuthStore } from '@/modules/auth';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { Button } from '@/components/ui';
import { AudioLinesIcon, PauseIcon, PencilIcon, PlayIcon, XIcon } from 'lucide-react';
import { formatDuration } from '@/utiils/function';
import { ColumnDef } from '@tanstack/react-table';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { ViewRedirectArtist } from '@/modules/artist';
import { FormCouPlaylist, FormDialogRemove } from '../components';
import { Playlist } from '../types';

export function PageDetails({ id }: { id: string }) {
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const [openUpdatePlaylist, setOpenUpdatePlaylist] = useState<boolean>(false);
  const [openRemovePlaylist, setOpenRemovePlaylist] = useState<boolean>(false);

  const { user } = useAuthStore((state) => state);
  const { setPlaylist, currentTrackIndex, isPlaying, playlist, track, pauseAudio, playAudio } =
    useSongStore((state) => state);

  const { isSuccess, data: dataDetails, isLoading: isLoadingDetails } = usePlaylistDetails(id);
  const t = useTranslations<NextIntl.Namespace<'PlaylistPage.details'>>('PlaylistPage.details');
  const tPlaylist = useTranslations<NextIntl.Namespace<'Component.playlist'>>('Component.playlist');

  const columns: ColumnDef<Song>[] = [
    {
      id: 'index',
      cell: ({ row }) => {
        const hovered = hoveredRowIndex === row.index;
        const isRowPlaying = isCurrentlyPlaying(row.original, {
          currentTrackIndex,
          isPlaying,
          playlist,
          track,
        });

        return (
          <div className="text-center flex justify-center">
            {hovered ? (
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  const isCurrent = track?.id === row.original.id;

                  if (isCurrent) {
                    if (isPlaying) {
                      pauseAudio();
                    } else {
                      playAudio();
                    }
                  } else {
                    setPlaylist(dataDetails?.songs as Song[], row.index);
                    playAudio();
                  }
                }}
              >
                {track?.id === row.original.id && isPlaying ? (
                  <PauseIcon className="fill-primary" />
                ) : (
                  <PlayIcon className="fill-primary" />
                )}
              </Button>
            ) : isRowPlaying ? (
              <AudioLinesIcon className="fill-primary-pink stroke-primary-pink w-5" />
            ) : (
              <div className="font-bold opacity-80">{row.index + 1}</div>
            )}
          </div>
        );
      },
      size: 5,
    },
    {
      id: 'title',
      cell: ({ row }) => {
        const isRowPlaying = isCurrentlyPlaying(row.original, {
          currentTrackIndex,
          isPlaying,
          playlist,
          track,
        });

        return (
          <div className="flex items-center gap-5 truncate">
            <div className="w-12 h-12 shrink-0 relative">
              <Image
                src={row.original.cover?.url ?? '/images/song-default-white.png'}
                alt={row.original.title}
                width={200}
                height={200}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <div className="flex flex-col gap-1">
              <Link
                href={`${Routes.Songs}/${row.original.id}`}
                className={cn(
                  'truncate font-bold hover:underline',
                  isRowPlaying && 'text-primary-pink',
                )}
                title={row.original.title}
              >
                {row.original.title}
              </Link>

              <div>
                <ViewRedirectArtist
                  artist={row.original.artist}
                  artists={row.original.artists}
                  className="text-[13px] font-bold"
                />
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: 'duration',
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-4">
          <span className="font-semibold opacity-80">{formatDuration(row.original.duration)}</span>
          <DropdownHelper song={row.original} />
        </div>
      ),
      size: 50,
    },
  ];

  return (
    <>
      <section className="h-full rounded-xl bg-sidebar overflow-x-hidden overflow-y-auto pt-16 relative">
        <div
          className="absolute inset-0 z-0 h-80"
          style={{
            backgroundImage: `url(${dataDetails?.cover ?? IMAGE_PLACEHOLDER})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(50px)',
            opacity: 0.4,
          }}
        />

        <div className="grid grid-cols-6 justify-center items-start gap-2 max-lg:gap-10 lg:px-16 p-4">
          <div className="lg:col-span-2 col-span-6 flex flex-col justify-center items-center max-lg:px-10 lg:max-w-72 ww-full">
            <div className="w-full h-full aspect-square shadow-2xl">
              <Image
                width={1000}
                height={1000}
                alt={dataDetails?.title ?? 'cover-playlist'}
                src={dataDetails?.cover ?? IMAGE_PLACEHOLDER}
                className="w-full h-full object-cover rounded-lg"
                unoptimized
              />
            </div>
            <h3
              className="text-2xl text-center font-bold line-clamp-3 truncate whitespace-normal mt-6"
              title={dataDetails?.title}
            >
              {dataDetails?.title}
            </h3>

            <div className="flex items-center gap-2 text-sm mt-4">
              <DispAvatar
                src={user?.avatar?.url ?? ''}
                alt={user?.name ?? ''}
                fallback={getShortName(user?.name ?? '')}
                className="object-cover"
              />
              <p className="font-medium opacity-80">
                {dataDetails?.userId === user?.id ? user?.name : 'Hệ thống'}
              </p>
            </div>

            <p className="mt-5 text-muted-foreground font-semibold">
              {dataDetails?.songs.length} {t('tracks').toLocaleLowerCase()} •{' '}
              {formatDurationSum(dataDetails?.songs.map((song) => song.duration) ?? [])}
            </p>

            <div className="mt-5 flex justify-center items-center gap-6">
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full w-10 h-10"
                onClick={() => {
                  setOpenUpdatePlaylist(true);
                }}
              >
                <PencilIcon />
              </Button>
              <Button
                onClick={() => {
                  setPlaylist(dataDetails?.songs ?? []);
                }}
                size="icon"
                className="h-16 w-16 rounded-full bg-primary hover:bg-primary-pink group"
                variant="outline"
              >
                <PlayIcon className="fill-background stroke-background group-hover:fill-primary group-hover:stroke-primary !w-6 !h-6" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="rounded-full w-10 h-10"
                onClick={() => {
                  setOpenRemovePlaylist(true);
                }}
              >
                <XIcon />
              </Button>
            </div>
          </div>

          <div className="lg:col-span-4 col-span-6">
            <DispTable
              columns={columns}
              data={(dataDetails?.songs as Song[]) ?? []}
              isLoading={isLoadingDetails}
              showHeader={false}
              cnTableRow="border-0 rounded-md"
              onRowMouseEnter={(rowIndex) => setHoveredRowIndex(rowIndex)}
              onRowMouseLeave={() => setHoveredRowIndex(null)}
            />
          </div>
        </div>
      </section>

      {openUpdatePlaylist ? (
        <FormCouPlaylist
          open={openUpdatePlaylist}
          setOpen={setOpenUpdatePlaylist}
          playlist={dataDetails}
        />
      ) : null}

      {openRemovePlaylist ? (
        <FormDialogRemove
          open={openRemovePlaylist}
          setOpen={setOpenRemovePlaylist}
          playlist={dataDetails as Playlist}
        />
      ) : null}
    </>
  );
}
