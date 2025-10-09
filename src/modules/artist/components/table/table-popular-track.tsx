'use client';

import { DispTable } from '@/components/common';
import { Button } from '@/components/ui';
import { Routes } from '@/constants/routes';
import { Link } from '@/i18n/navigation';
import { cn } from '@/lib/utils';
import {
  DropdownHelper,
  formatNumber,
  isCurrentlyPlaying,
  Song,
  useSongStore,
} from '@/modules/song';
import { formatDuration } from '@/utiils/function';
import { ColumnDef } from '@tanstack/react-table';
import { AudioLinesIcon, Clock10, PauseIcon, PlayIcon } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';
import { ApiReturnList } from '~types/common';
import { ViewRedirectArtist } from '../view/view-redirect';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';

type TablePopularTrackProps = {
  songResults?: ApiReturnList<Song>;
  songLoading?: boolean;
  showArtistRedirect?: boolean;
};

export function TablePopularTrack({
  songLoading,
  songResults,
  showArtistRedirect = false,
}: TablePopularTrackProps) {
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const { setPlaylist, track, playlist, currentTrackIndex, isPlaying, playAudio, pauseAudio } =
    useSongStore((state) => state);
  const t = useTranslations<NextIntl.Namespace<'Component.table'>>('Component.table');

  const columns: ColumnDef<Song>[] = [
    {
      id: 'index',
      header: t('no'),
      meta: {
        style: {
          textAlign: 'center',
        },
      },
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
                    setPlaylist(songResults?.data as Song[], row.index);
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
      header: t('title'),
      cell: ({ row }) => {
        const isRowPlaying = isCurrentlyPlaying(row.original, {
          currentTrackIndex,
          isPlaying,
          playlist,
          track,
        });

        return (
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 shrink-0 relative">
              <Image
                src={row.original.cover?.url ?? '/images/song-default-white.png'}
                alt={row.original.title}
                width={200}
                height={200}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <div className="flex flex-col items-start truncate">
              <Link
                href={`${Routes.Songs}/${row.original.id}`}
                className={cn(
                  'font-semibold hover:underline',
                  isRowPlaying && 'text-primary-pink',
                )}
                title={row.original.title}
              >
                {row.original.title}
              </Link>

              {showArtistRedirect && (
                <ViewRedirectArtist artist={row.original.artist} artists={row.original.artists} />
              )}
            </div>
          </div>
        );
      },
    },
    {
      id: 'view',
      cell: ({ row }) => (
        <div className="font-semibold opacity-80 text-center">
          {formatNumber(row.original.playCount)}
        </div>
      ),
      size: 100,
    },
    {
      id: 'duration',
      header: () => (
        <div className="flex justify-center">
          <Clock10 size={18} />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-4">
          <span className="font-semibold opacity-80">{formatDuration(row.original.duration)}</span>
          <DropdownHelper song={row.original} />
          {/* {hoveredRowIndex === row.index ? <DropdownHelper song={row.original} /> : null} */}
        </div>
      ),
      size: 50,
    },
  ];

  return (
    <DispTable
      columns={columns}
      data={(songResults?.data as Song[]) ?? []}
      isLoading={songLoading}
      cnTableRow="border-0 rounded-md"
      onRowMouseEnter={(rowIndex) => setHoveredRowIndex(rowIndex)}
      onRowMouseLeave={() => setHoveredRowIndex(null)}
    />
  );
}
