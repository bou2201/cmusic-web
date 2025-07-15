'use client';

import { useState } from 'react';
import { Genre } from '../types';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { useGenreStore } from '../store';
import { useQuery } from '@tanstack/react-query';
import { genreService } from '../service';
import { DispDropdown, DispTable, SectionMnt } from '@/components/common';
import { Button } from '@/components/ui';
import { EllipsisIcon } from 'lucide-react';
import { ColumnDef } from '@tanstack/react-table';

export function PageGenresMnt() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [openCou, setOpenCou] = useState<boolean>(false);
  const [currentGenre, setCurrentGenre] = useState<Genre | undefined>(undefined);

  const t = useTranslations<NextIntl.Namespace<'GenrePage.genreMnt'>>('GenrePage.genreMnt');
  const filters = useGenreStore((state) => state.filters);

  const { data: dataGenres, isLoading } = useQuery({
    queryKey: ['genres-mnt', page, limit, filters],
    queryFn: () => genreService.getListGenre({ page, limit, ...filters }),
  });

  const columns: ColumnDef<Genre>[] = [
    {
      accessorKey: 'name',
      header: t('table.name'),
      size: 200,
      cell: ({ row }) => {
        return (
          <span
            className="font-semibold truncate line-clamp-1 hover:underline"
            title={row.original.name}
          >
            {row.original.name}
          </span>
        );
      },
    },
    {
      accessorKey: 'slug',
      header: t('table.slug'),
      size: 200,
    },
    {
      accessorKey: 'description',
      header: t('table.desciption'),
      size: 300,
    },
    {
      accessorKey: 'isFeatured',
      header: t('table.featured'),
      size: 60,
      cell: ({ row }) => {
        return (
          <span className="font-semibold opacity-80">{row.original.isFeatured ? '✔' : '-'}</span>
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
  ];

  return (
    <>
      <SectionMnt
        title={t('title')}
        addBtn
        onClick={() => {
          setOpenCou(true);
        }}
      >
        {/* <FormFiltersMnt /> */}
        <DispTable
          columns={columns}
          data={dataGenres?.data ?? []}
          isLoading={isLoading}
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

      {/* {openCou ? (
    <FormCouMnt
      open={openCou}
      setOpen={setOpenCou}
      artist={currentArtist}
      setArtist={setCurrentAritst}
    />
  ) : null} */}
    </>
  );
}
