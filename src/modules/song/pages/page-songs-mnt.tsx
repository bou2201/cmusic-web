'use client';

import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { songService } from '../service';
import { DispDropdown, DispTable, SectionMnt } from '@/components/common';
import { ColumnDef } from '@tanstack/react-table';
import { Song } from '../types';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { formatDuration } from '@/utiils/function';
import Image from 'next/image';
import { formatNumber } from '../utils/function';
import { Button, LoadingSwitch } from '@/components/ui';
import { EllipsisIcon } from 'lucide-react';
import { useSongStore } from '../store';
import { FormFiltersMnt } from '../components';
import { Link, useRouter } from '@/i18n/navigation';
import { Routes } from '@/constants/routes';
import { IMAGE_PLACEHOLDER } from '@/constants/link';
import { toast } from 'sonner';

export function PageSongsMnt() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const t = useTranslations<NextIntl.Namespace<'SongsPage.songMnt'>>('SongsPage.songMnt');
  const filters = useSongStore((state) => state.filters);
  const router = useRouter();
  const queryClient = useQueryClient();

  const {
    data: dataSongs,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['songs-mnt', page, limit, filters],
    queryFn: () => songService.getListSong({ page, limit, ...filters }),
    placeholderData: keepPreviousData,
  });

  const columns: ColumnDef<Song>[] = useMemo(
    () => [
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
              className="font-semibold line-clamp-2 whitespace-break-spaces hover:underline"
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
            <div className="line-clamp-2 whitespace-break-spaces">
              <span className="font-medium text-sm text-zinc-400">
                {artist.name}
                {artists.length > 1 && ` (${[...artists.map((art) => art.name)].join(', ')})`}
              </span>
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
            <span className="font-semibold opacity-80">
              {formatDuration(row.original.duration)}
            </span>
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
        meta: {
          style: {
            textAlign: 'center',
          },
        },
        cell: ({ row }) => {
          return (
            <LoadingSwitch
              checked={row.original.isPublic}
              onCheckedChange={async (checked) => {
                try {
                  // Optimistic update
                  queryClient.setQueryData(['songs-mnt', page, limit, filters], (oldData: any) => {
                    if (!oldData) return oldData;
                    return {
                      ...oldData,
                      data: oldData.data.map((song: Song) =>
                        song.id === row.original.id ? { ...song, isPublic: checked } : song,
                      ),
                    };
                  });

                  await songService.togglePublic(row.original.id);
                  toast.success(t('createOrUpdate.hiddenUpdateSuccess'));
                } catch (error) {
                  // Revert if failed
                  queryClient.invalidateQueries({ queryKey: ['songs-mnt'] });
                  toast.error(t('createOrUpdate.hiddenUpdateFailed'));
                }
              }}
            />
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
              onCheckedChange={async (checked) => {
                try {
                  // Optimistic update
                  queryClient.setQueryData(['songs-mnt', page, limit, filters], (oldData: any) => {
                    if (!oldData) return oldData;
                    return {
                      ...oldData,
                      data: oldData.data.map((song: Song) =>
                        song.id === row.original.id ? { ...song, isTrending: checked } : song,
                      ),
                    };
                  });

                  await songService.toggleTrending(row.original.id);
                  toast.success(t('createOrUpdate.trendingUpdateSuccess'));
                } catch (error) {
                  // Revert if failed
                  queryClient.invalidateQueries({ queryKey: ['songs-mnt'] });
                  toast.error(t('createOrUpdate.trendingUpdateFailed'));
                }
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
                // {
                //   key: 'action-edit-public',
                //   label: row.original.isPublic ? t('action.hidden') : t('action.unHidden'),
                // },
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
    ],
    [filters, limit, page, queryClient, router, t],
  );

  return (
    <SectionMnt
      title={t('title')}
      addBtn
      onClick={() => {
        router.push(Routes.AdminSongs + '/create');
      }}
    >
      <FormFiltersMnt setPage={setPage} />
      <DispTable
        columns={columns}
        data={dataSongs?.data ?? []}
        isLoading={isLoading || isFetching}
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
