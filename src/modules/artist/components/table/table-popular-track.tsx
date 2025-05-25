'use client';
import { DispTable } from '@/components/common';
import { Routes } from '@/constants/routes';
import { Link } from '@/i18n/navigation';
import { Song, songService } from '@/modules/song';
import { formatDuration } from '@/utiils/function';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';

const columns: ColumnDef<Song>[] = [
  {
    id: 'index',
    cell: ({ row }) => <div className="text-center font-bold opacity-80">{row.index + 1}</div>,
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
        <Link href={`${Routes.Songs}/${row.original.id}`} className="truncate font-bold hover:underline">
          {row.original.title}
        </Link>
      </div>
    ),
  },
  {
    id: 'view',
    cell: ({ row }) => (
      <div className="font-semibold opacity-80  text-center">{row.original._count.likedBy}</div>
    ),
    size: 100,
  },
  {
    id: 'duration',
    cell: ({ row }) => (
      <div className="font-semibold opacity-80 text-center">
        {formatDuration(row.original.duration)}
      </div>
    ),
    size: 50,
  },
];

export function TablePopularTrack({ artistId }: { artistId: string }) {
  const { data: songResults, isLoading: songLoading } = useQuery({
    queryKey: ['song', 'artist-details', artistId],
    queryFn: () => songService.getListSong({ page: 1, limit: 10, artistId }),
  });

  return (
    <DispTable
      columns={columns}
      data={songResults?.data as Song[]}
      isLoading={songLoading}
      showHeader={false}
      cnTableRow="border-0 rounded-md"
    />
  );
}
