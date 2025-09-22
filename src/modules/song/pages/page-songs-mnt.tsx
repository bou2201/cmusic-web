'use client';

import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { songService } from '../service';
import { DispDropdown, DispTable, SectionMnt } from '@/components/common';
import { ColumnDef } from '@tanstack/react-table';
import { Song } from '../types';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { formatDuration } from '@/utiils/function';
import { ViewRedirectArtist } from '@/modules/artist';
import Image from 'next/image';
import { formatNumber } from '../utils/function';
import { Button, LoadingSwitch, Switch } from '@/components/ui';
import { EllipsisIcon } from 'lucide-react';
import { useSongStore } from '../store';
import { FormFiltersMnt } from '../components';
import { Link, useRouter } from '@/i18n/navigation';
import { Routes } from '@/constants/routes';
import { IMAGE_PLACEHOLDER } from '@/constants/link';

export function PageSongsMnt() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const t = useTranslations<NextIntl.Namespace<'SongsPage.songMnt'>>('SongsPage.songMnt');
  const filters = useSongStore((state) => state.filters);
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: dataSongs, isLoading } = useQuery({
    queryKey: ['songs-mnt', page, limit, filters],
    queryFn: () => songService.getListSong({ page, limit, ...filters }),
  });

  const columns: ColumnDef<Song>[] = [
    {
      accessorKey: 'cover',
      header: t('table.cover'),
      size: 60,
      cell: ({ row }) => {
        return (
          <div className="w-12 h-12 shrink-0">
            <Image
              src={row.original.cover?.url ?? IMAGE_PLACEHOLDER}
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
      size: 220,
      cell: ({ row }) => {
        return (
          <Link
            href={`${Routes.AdminSongs}/update?id=${row.original.id}`}
            className="font-semibold truncate line-clamp-2 hover:underline"
            title={row.original.title}
          >
            {row.original.title}
          </Link>
        );
      },
    },
    {
      accessorKey: 'artist',
      header: t('table.artist'),
      size: 140,
      cell: ({ row }) => {
        const artist = row.original.artist;
        const artists = row.original.artists;

        return (
          <div className="line-clamp-1 truncate">
            <ViewRedirectArtist artist={artist} artists={artists} admin />
          </div>
        );
      },
    },
    {
      accessorKey: 'duration',
      header: t('table.duration'),
      size: 90,
      cell: ({ row }) => {
        return (
          <span className="font-semibold opacity-80">{formatDuration(row.original.duration)}</span>
        );
      },
    },
    {
      accessorKey: 'playCount',
      header: t('table.playCount'),
      size: 90,
      cell: ({ row }) => {
        return (
          <span className="font-semibold opacity-80">{formatNumber(row.original.playCount)}</span>
        );
      },
    },
    {
      accessorKey: 'isPublic',
      header: t('table.isPublic'),
      size: 60,
      cell: ({ row }) => {
        return (
          <span className="font-semibold opacity-80">{row.original.isPublic ? '✔' : '-'}</span>
        );
      },
    },
    {
      accessorKey: 'isTrending',
      header: 'Trending',
      size: 60,
      meta: {
        style: {
          textAlign: 'center',
        },
      },
      cell: ({ row }) => {
        return (
          <LoadingSwitch
            checked={row.original.isTrending}
            onCheckedChange={async () => {
              await songService.toggleTrending(row.original.id);
              queryClient.invalidateQueries({ queryKey: ['songs-mnt'] });
            }}
          />
        );
      },
    },
    {
      id: 'action',
      size: 60,
      cell: ({ row }) => {
        return (
          <DispDropdown
            menu={[
              {
                key: 'action-edit',
                label: t('action.edit'),
                onClick: () => {
                  router.push(Routes.AdminSongs + '/update?id=' + row.original.id);
                },
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
    <SectionMnt
      title={t('title')}
      addBtn
      onClick={() => {
        router.push(Routes.AdminSongs + '/create');
      }}
    >
      <FormFiltersMnt />
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
