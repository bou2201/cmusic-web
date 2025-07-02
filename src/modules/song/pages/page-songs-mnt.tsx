'use client';

import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { songService } from '../service';
import { DispDropdown, DispTable, SectionMnt } from '@/components/common';
import { ColumnDef } from '@tanstack/react-table';
import { Song } from '../types';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { formatDuration, getArtistInfo } from '@/utiils/function';
import { ViewRedirectArtist } from '@/modules/artist';
import Image from 'next/image';
import { formatNumber } from '../utils/function';
import { Button } from '@/components/ui';
import { EllipsisIcon } from 'lucide-react';

export function PageSongsMnt() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const t = useTranslations<NextIntl.Namespace<'SongsPage.songMnt'>>('SongsPage.songMnt');

  const { data: dataSongs, isLoading } = useQuery({
    queryKey: ['songs-mnt', page, limit],
    queryFn: () => songService.getListSong({ page, limit }),
  });

  const columns: ColumnDef<Song>[] = [
    {
      accessorKey: 'cover',
      header: t('table.cover'),
      size: 30,
      cell: ({ row }) => {
        return (
          <div className="w-12 h-12 shrink-0">
            <Image
              src={row.original.cover?.url ?? '/images/song-default-white.png'}
              alt={row.original.title}
              width={200}
              height={200}
              className="w-full h-full object-cover rounded-md"
            />
          </div>
        );
      },
    },
    {
      accessorKey: 'title',
      header: t('table.title'),
      size: 280,
      cell: ({ row }) => {
        return (
          <span className="font-semibold truncate line-clamp-1" title={row.original.title}>
            {row.original.title}
          </span>
        );
      },
    },
    {
      accessorKey: 'artist',
      header: t('table.artist'),
      size: 120,
      cell: ({ row }) => {
        const artist = row.original.artist;
        const artists = row.original.artists;

        return <ViewRedirectArtist artist={artist} artists={artists} />;
      },
    },
    {
      accessorKey: 'duration',
      header: t('table.duration'),
      size: 70,
      cell: ({ row }) => {
        return (
          <span className="font-semibold opacity-80">{formatDuration(row.original.duration)}</span>
        );
      },
    },
    {
      accessorKey: 'playCount',
      header: t('table.playCount'),
      size: 70,
      cell: ({ row }) => {
        return (
          <span className="font-semibold opacity-80">{formatNumber(row.original.playCount)}</span>
        );
      },
    },
    {
      accessorKey: 'isPublic',
      header: t('table.isPublic'),
      size: 40,
      cell: ({ row }) => {
        return (
          <span className="font-semibold opacity-80">{row.original.isPublic ? '✔' : '-'}</span>
        );
      },
    },
    {
      id: 'action',
      size: 40,
      cell: ({ row }) => {
        return (
          <DispDropdown
            menu={[
              {
                key: 'action-edit',
                label: t('action.edit'),
              },
              {
                key: 'action-edit-public',
                label: row.original.isPublic ? t('action.hidden') : t('action.unHidden'),
              },
            ]}
            modal={false}
          >
            <div className="flex justify-center text-center">
              <Button size="icon" variant="ghost">
                <EllipsisIcon />
              </Button>
            </div>
          </DispDropdown>
        );
      },
    },
  ];

  return (
    <SectionMnt title={t('title')} addBtn>
      <DispTable
        columns={columns}
        data={dataSongs?.data ?? []}
        isLoading={isLoading}
        pagination={{
          limit,
          page,
          setLimit,
          setPage,
          total: dataSongs?.meta.total ?? 0,
          totalPages: dataSongs?.meta.totalPages ?? 0,
        }}
      />
    </SectionMnt>
  );
}
