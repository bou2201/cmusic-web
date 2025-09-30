'use client';

import { useMemo, useState } from 'react';
import { Album } from '../types';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { useAlbumStore } from '../store';
import { keepPreviousData, useQuery, useQueryClient } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { albumService } from '../service';
import Image from 'next/image';
import { IMAGE_PLACEHOLDER } from '@/constants/link';
import { DispDropdown, DispTable, SectionMnt } from '@/components/common';
import { FormCouMnt, FormFiltersMnt } from '../components';
import { Button, LoadingSwitch } from '@/components/ui';
import { EllipsisIcon } from 'lucide-react';

export function PageAlbumsMnt() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [openCou, setOpenCou] = useState<boolean>(false);
  const [currentAlbum, setCurrentAlbum] = useState<Album | undefined>(undefined);

  const t = useTranslations<NextIntl.Namespace<'AlbumsPage.albumMnt'>>('AlbumsPage.albumMnt');
  const filters = useAlbumStore((state) => state.filters);
  const queryClient = useQueryClient();

  const {
    data: dataAlbums,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['albums-mnt', page, limit, filters],
    queryFn: () => albumService.getListAlbum({ page, limit, ...filters }),
    placeholderData: keepPreviousData,
  });

  const columns: ColumnDef<Album>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: t('table.name'),
        size: 150,
        cell: ({ row }) => {
          console.log(row.original)
          return (
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 shrink-0">
                <Image
                  src={row.original.cover?.url ?? IMAGE_PLACEHOLDER}
                  alt={row.original.title}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <span
                className="font-semibold truncate line-clamp-2 hover:underline"
                title={row.original.title}
              >
                {row.original.title}
              </span>
            </div>
          );
        },
      },
      {
        accessorKey: 'releaseDate',
        header: t('table.releaseDate'),
        size: 140,
        cell: ({ row }) => {
          return (
            <span className="font-semibold opacity-80">
              {new Date(row.original.releaseDate).toLocaleDateString()}
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
      // {
      //   accessorKey: 'isFeatured',
      //   header: t('table.featured'),
      //   size: 60,
      //   meta: {
      //     style: {
      //       textAlign: 'center',
      //     },
      //   },
      //   cell: ({ row }) => {
      //     return (
      //       <LoadingSwitch
      //         checked={row.original.isFeatured}
      //         onCheckedChange={async () => {
      //           await albumService.toggleAlbumFeatured(row.original.id);
      //           queryClient.invalidateQueries({ queryKey: ['albums-mnt'] });
      //         }}
      //       />
      //     );
      //   },
      // },
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
                    setCurrentAlbum(row.original);
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
    [t],
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
          data={dataAlbums?.data ?? []}
          isLoading={isLoading || isFetching}
          pagination={{
            limit,
            page,
            setLimit,
            setPage,
            total: dataAlbums?.meta.total ?? 0,
            totalPages: dataAlbums?.meta.totalPages ?? 0,
          }}
        />
      </SectionMnt>

      {openCou ? (
        <FormCouMnt
          open={openCou}
          setOpen={setOpenCou}
          album={currentAlbum}
          setAlbum={setCurrentAlbum}
        />
      ) : null}
    </>
  );
}
