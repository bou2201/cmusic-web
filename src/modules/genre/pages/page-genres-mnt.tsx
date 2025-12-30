'use client';

import { useMemo, useState } from 'react';
import { Genre } from '../types';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { useGenreStore } from '../store';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { genreService } from '../service';
import { DispDropdown, DispTable, SectionMnt } from '@/components/common';
import { Button, LoadingSwitch } from '@/components/ui';
import { EllipsisIcon } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';
import { FormCouMnt, FormFiltersMnt } from '../components';

export function PageGenresMnt() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [openCou, setOpenCou] = useState<boolean>(false);
  const [currentGenre, setCurrentGenre] = useState<Genre | undefined>(undefined);

  const t = useTranslations<NextIntl.Namespace<'GenrePage.genreMnt'>>('GenrePage.genreMnt');
  const filters = useGenreStore((state) => state.filters);
  const queryClient = useQueryClient();

  const {
    data: dataGenres,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['genres-mnt', page, limit, filters],
    queryFn: () => genreService.getListGenre({ page, limit, ...filters }),
    placeholderData: keepPreviousData,
  });

  const columns: ColumnDef<Genre>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: t('table.name'),
        size: 150,
        cell: ({ row }) => {
          return (
            <span
              className="font-semibold truncate line-clamp-1 hover:underline cursor-pointer"
              title={row.original.name}
              onClick={() => {
                setOpenCou(true);
                setCurrentGenre(row.original);
              }}
            >
              {row.original.name}
            </span>
          );
        },
      },
      {
        accessorKey: 'slug',
        header: t('table.slug'),
        size: 150,
        cell: ({ row }) => {
          return (
            <span className="whitespace-break-spaces line-clamp-2" title={row.original.slug}>
              {row.original.slug}
            </span>
          );
        },
      },
      {
        accessorKey: 'description',
        header: t('table.description'),
        size: 250,
        cell: ({ row }) => {
          return (
            <span className="whitespace-break-spaces line-clamp-2" title={row.original.description}>
              {row.original.description}
            </span>
          );
        },
      },
      {
        accessorKey: 'isFeatured',
        header: t('table.featured'),
        size: 60,
        meta: {
          style: {
            textAlign: 'center',
          },
        },
        cell: ({ row }) => {
          return (
            <LoadingSwitch
              checked={row.original.isFeatured}
              onCheckedChange={async (checked) => {
                try {
                  // Optimistic update
                  queryClient.setQueryData(['genres-mnt', page, limit, filters], (oldData: any) => {
                    if (!oldData) return oldData;
                    return {
                      ...oldData,
                      data: oldData.data.map((genre: Genre) =>
                        genre.id === row.original.id ? { ...genre, isTrending: checked } : genre,
                      ),
                    };
                  });

                  await genreService.toggleGenreFeatured(row.original.id);
                } catch (error) {
                  // Revert if failed
                  queryClient.invalidateQueries({ queryKey: ['genres-mnt'] });
                }
                // await genreService.toggleGenreFeatured(row.original.id);
                // queryClient.invalidateQueries({ queryKey: ['genres-mnt'] });
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
                    setOpenCou(true);
                    setCurrentGenre(row.original);
                  },
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
    ],
    [filters, limit, page, queryClient, t],
  );

  return (
    <>
      <SectionMnt
        title={t('title')}
        addBtn
        onClick={() => {
          setOpenCou(true);
        }}
      >
        <FormFiltersMnt />
        <DispTable
          columns={columns}
          data={dataGenres?.data ?? []}
          isLoading={isLoading || isFetching}
          pagination={{
            limit,
            page,
            setLimit,
            setPage,
            total: dataGenres?.meta.total ?? 0,
            totalPages: dataGenres?.meta.totalPages ?? 0,
          }}
        />
      </SectionMnt>

      {openCou ? (
        <FormCouMnt
          open={openCou}
          setOpen={setOpenCou}
          genre={currentGenre}
          setGenre={setCurrentGenre}
        />
      ) : null}
    </>
  );
}
