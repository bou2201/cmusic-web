'use client';
import { DispTable } from '@/components/common';
import { Button } from '@/components/ui';
import { Routes } from '@/constants/routes';
import { Link } from '@/i18n/navigation';
import { formatNumber, Song, songService, useSongStore } from '@/modules/song';
import { formatDuration } from '@/utiils/function';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { Ellipsis, Play } from 'lucide-react';
import Image from 'next/image';
import { useState } from 'react';

export function TablePopularTrack({ artistId }: { artistId: string }) {
  const [hoveredRowIndex, setHoveredRowIndex] = useState<number | null>(null);
  const setTrack = useSongStore((state) => state.setTrack);

  const { data: songResults, isLoading: songLoading } = useQuery({
    queryKey: ['song', 'artist-details', artistId],
    queryFn: () => songService.getListSong({ page: 1, limit: 10, artistId }),
  });

  const columns: ColumnDef<Song>[] = [
    {
      id: 'index',
      cell: ({ row }) => (
        <div className="text-center">
          {hoveredRowIndex === row.index ? (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                setTrack(row.original);
              }}
            >
              <Play className="fill-primary" />
            </Button>
          ) : (
            <div className="font-bold opacity-80">{row.index + 1}</div>
          )}
        </div>
      ),
      size: 5,
    },
    {
      id: 'title',
      cell: ({ row }) => (
        <div className="flex items-center gap-5">
          <div className="w-12 h-12 shrink-0">
            <Image
              src={row.original.cover?.url ?? '/images/song-default-white.png'}
              alt={row.original.title}
              width={200}
              height={200}
              className="w-ful h-full object-cover rounded-md"
            />
          </div>
          <Link
            href={`${Routes.Songs}/${row.original.id}`}
            className="truncate font-bold hover:underline"
          >
            {row.original.title}
          </Link>
        </div>
      ),
    },
    {
      id: 'view',
      cell: ({ row }) => (
        <div className="font-semibold opacity-80  text-center">
          {formatNumber(row.original.playCount)}
        </div>
      ),
      size: 100,
    },
    {
      id: 'duration',
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-4">
          <span className="font-semibold opacity-80">{formatDuration(row.original.duration)}</span>
          {hoveredRowIndex === row.index ? (
            <Button size="icon" variant="ghost">
              <Ellipsis />
            </Button>
          ) : null}
        </div>
      ),
      size: 50,
    },
  ];

  return (
    <DispTable
      columns={columns}
      data={songResults?.data as Song[]}
      isLoading={songLoading}
      showHeader={false}
      cnTableRow="border-0 rounded-md"
      onRowMouseEnter={(rowIndex) => setHoveredRowIndex(rowIndex)}
      onRowMouseLeave={() => setHoveredRowIndex(null)}
    />
  );
}
