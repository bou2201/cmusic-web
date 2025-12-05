'use client';

import { useTranslations } from 'next-intl';
import { useMemo, useState } from 'react';
import { NextIntl } from '~types/next-intl';
import { useUserStore } from '../store';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { ColumnDef } from '@tanstack/react-table';
import { userService } from '../service';
import { User } from '../types';
import { DispDropdown, DispTable, SectionMnt } from '@/components/common';
import { Badge, Button } from '@/components/ui';
import { EllipsisIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { FormBlockUser, FormFiltersMnt } from '../components';
import { useAuthStore } from '@/modules/auth';

export function PageUsersMnt() {
  const [page, setPage] = useState<number>(1);
  const [limit, setLimit] = useState<number>(10);
  const [openBlock, setOpenBlock] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | undefined>(undefined);

  const t = useTranslations<NextIntl.Namespace<'UserPage'>>('UserPage');
  const filters = useUserStore((state) => state.filters);
  const { user } = useAuthStore((state) => state);

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
              className="font-semibold truncate line-clamp-1 hover:underline py-2"
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
            <span className="font-semibold text-muted-foreground" title={row.original.role}>
              {row.original.role}
            </span>
          );
        },
      },
      {
        accessorKey: 'status',
        header: t('userMnt.table.status'),
        size: 100,
        cell: ({ row }) => {
          const isBlocked = row.original.isBlocked;
          return (
            <Badge
              variant={isBlocked ? 'destructive' : 'outline'}
              className={cn('font-bold', !isBlocked && 'text-chart-2')}
            >
              <span
                className={cn('size-1.5 rounded-full', isBlocked ? 'bg-primary' : 'bg-chart-2')}
                aria-hidden="true"
              />
              {isBlocked ? t('userMnt.table.isBlocked') : t('userMnt.table.active')}
            </Badge>
          );
        },
      },
      {
        id: 'action',
        size: 60,
        cell: ({ row }) => {
          const id = row.original.id;
          const isBlocked = row.original.isBlocked;

          return user?.id === id ? null : (
            <DispDropdown
              menu={[
                {
                  key: isBlocked ? 'action-unblock' : 'action-block',
                  label: isBlocked ? t('userMnt.action.unblock') : t('userMnt.action.block'),
                  onClick: () => {
                    setCurrentUser(row.original);
                    setOpenBlock(true);
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
      <SectionMnt title={t('metadata.title')}>
        <FormFiltersMnt setPage={setPage} />
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

      {openBlock && (
        <FormBlockUser open={openBlock} setOpen={setOpenBlock} user={currentUser as User} />
      )}
    </>
  );
}
