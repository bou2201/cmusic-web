'use client';

import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { NextIntl } from '~types/next-intl';
import { useUserStore } from '../store';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { userService } from '../service';
import { User } from '../types';
import { DispTable, SectionMnt } from '@/components/common';

export function PageUsersMnt() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);

  const t = useTranslations<NextIntl.Namespace<'UserPage'>>('UserPage');
  const filters = useUserStore((state) => state.filters);

  const {
    data: dataUsers,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['users-mnt', page, limit, filters],
    queryFn: () => userService.getListUser({ page, limit, ...filters }),
    placeholderData: keepPreviousData,
  });

  const columns: ColumnDef<User>[] = useMemo(
    () => [
      {
        accessorKey: 'name',
        header: t('userMnt.table.username'),
        size: 100,
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
        accessorKey: 'email',
        header: t('userMnt.table.email'),
        size: 150,
      },
      {
        accessorKey: 'role',
        header: t('userMnt.table.role'),
        size: 100,
        cell: ({ row }) => {
          return (
            <span
              className="font-semibold text-muted-foreground"
              title={row.original.role}
            >
              {row.original.role}
            </span>
          );
        },
      }
    ],
    [t],
  );

  return (
    <SectionMnt title={t('metadata.title')}>
      {/* <FormFiltersMnt /> */}
      <DispTable
        columns={columns}
        data={dataUsers?.data ?? []}
        isLoading={isLoading || isFetching}
        pagination={{
          limit,
          page,
          setLimit,
          setPage,
          total: dataUsers?.meta.total ?? 0,
          totalPages: dataUsers?.meta.totalPages ?? 0,
        }}
      />
    </SectionMnt>
  );
}
