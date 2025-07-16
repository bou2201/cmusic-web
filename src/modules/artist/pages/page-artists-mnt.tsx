'use client';

import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { NextIntl } from '~types/next-intl';
import { artistService } from '../service';
import { ColumnDef } from '@tanstack/react-table';
import { Artist } from '../types';
import Image from 'next/image';
import { Button } from '@/components/ui';
import { EllipsisIcon } from 'lucide-react';
import { DispDropdown, DispTable, SectionMnt } from '@/components/common';
import { FormCouMnt, FormFiltersMnt } from '../components';
import { useArtistStore } from '../store';

export function PageArtistsMnt() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [openCou, setOpenCou] = useState<boolean>(false);
  const [currentArtist, setCurrentAritst] = useState<Artist | undefined>(undefined);

  const t = useTranslations<NextIntl.Namespace<'ArtistPage.artistMnt'>>('ArtistPage.artistMnt');
  const filters = useArtistStore((state) => state.filters);

  const { data: dataArtists, isLoading } = useQuery({
    queryKey: ['artists-mnt', page, limit, filters],
    queryFn: () => artistService.getListArtist({ page, limit, ...filters }),
  });

  const columns: ColumnDef<Artist>[] = [
    {
      accessorKey: 'avatar',
      header: t('table.avatar'),
      size: 60,
      cell: ({ row }) => {
        return (
          <div className="w-12 h-12 shrink-0">
            <Image
              src={row.original.avatar?.url ?? '/images/song-default-white.png'}
              alt={row.original.name}
              width={200}
              height={200}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        );
      },
    },
    {
      accessorKey: 'name',
      header: t('table.name'),
      size: 200,
      cell: ({ row }) => {
        return (
          <span
            className="font-semibold truncate line-clamp-1 hover:underline"
            title={row.original.name}
            onClick={() => {
              setOpenCou(true);
              setCurrentAritst(row.original);
            }}
          >
            {row.original.name}
          </span>
        );
      },
    },
    {
      accessorKey: '_count.songs',
      header: t('table.songs'),
      size: 80,
    },
    {
      accessorKey: '_count.followers',
      header: t('table.followers'),
      size: 100,
    },
    {
      accessorKey: 'isPopular',
      header: t('table.popular'),
      size: 60,
      cell: ({ row }) => {
        return (
          <span className="font-semibold opacity-80">{row.original.isPopular ? '✔' : '-'}</span>
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
                  setCurrentAritst(row.original);
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
        <FormFiltersMnt />
        <DispTable
          columns={columns}
          data={dataArtists?.data ?? []}
          isLoading={isLoading}
          pagination={{
            limit,
            page,
            setLimit,
            setPage,
            total: dataArtists?.meta.total ?? 0,
            totalPages: dataArtists?.meta.totalPages ?? 0,
          }}
        />
      </SectionMnt>

      {openCou ? (
        <FormCouMnt
          open={openCou}
          setOpen={setOpenCou}
          artist={currentArtist}
          setArtist={setCurrentAritst}
        />
      ) : null}
    </>
  );
}
