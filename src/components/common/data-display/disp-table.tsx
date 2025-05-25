'use client';

import {
  Button,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui';
import {
  Table as TableType,
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ApiReturnList } from '~types/common';
import { DispEmpty } from './disp-empty';
import { DispDropdown, DispDropdownMenuProps } from './disp-dropdown';
import { useMemo } from 'react';
import { ChevronsUpDown, MoveLeft, MoveRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';

export type DispTableProps<TData, TValue> = {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pagination?: DispTablePaginationProps<TData>;
  isLoading?: boolean;
  countLoading?: number;
  cnTable?: string;
  cnTableHead?: string;
  cnTableBody?: string;
  cnTableRow?: string;
  cnSkeleton?: string;
  titleNoResult?: string;
  showHeader?: boolean;
};

export type DispTableLoadingProps<TData> = {
  table: TableType<TData>;
  countLoading: number;
  cnSkeleton?: string;
};

export type DispTablePaginationProps<TData> = {
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
} & ApiReturnList<TData>['meta'];

export function DispTable<TData, TValue>({
  columns,
  data,
  pagination,
  isLoading,
  countLoading = 5,
  cnTable,
  cnTableHead,
  cnTableBody,
  cnTableRow,
  cnSkeleton,
  titleNoResult,
  showHeader = true,
}: DispTableProps<TData, TValue>) {
  const table = useReactTable<TData>({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    manualExpanding: true,
    manualFiltering: true,
    manualSorting: true,
    manualPagination: true,
    rowCount: pagination?.limit ?? 0,
  });

  return (
    <section className="w-full">
      <div className="rounded-md">
        <Table className={cnTable}>
          {/* Header */}
          {showHeader ? (
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className={cnTableRow}>
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        style={{
                          minWidth: header.column.columnDef.size,
                          maxWidth: header.column.columnDef.size,
                        }}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    );
                  })}
                </TableRow>
              ))}
            </TableHeader>
          ) : null}

          {/* Body */}
          {isLoading ? (
            <DispTableLoading table={table} countLoading={countLoading} cnSkeleton={cnSkeleton} />
          ) : (
            <TableBody className={cnTableBody}>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    className={cnTableRow}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        style={{
                          minWidth: cell.column.columnDef.size,
                          maxWidth: cell.column.columnDef.size,
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    <DispEmpty title={titleNoResult} />
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </div>

      {/* Pagination */}
      {pagination ? <DispTablePagination<TData> {...pagination} /> : null}
    </section>
  );
}

function DispTableLoading<TData>({
  table,
  countLoading,
  cnSkeleton,
}: DispTableLoadingProps<TData>) {
  return table.getHeaderGroups().map((headerGroup) =>
    Array.from({ length: countLoading }, (_) => (
      <TableRow key={headerGroup.id}>
        {headerGroup.headers.map((header) => {
          return (
            <TableHead key={header.id} className="py-2">
              <Skeleton className={`h-10 w-full ${cnSkeleton ?? ''}`} />
            </TableHead>
          );
        })}
      </TableRow>
    )),
  );
}

function DispTablePagination<TData>({
  page,
  limit,
  total,
  totalPages,
  setPage,
  setLimit,
}: DispTablePaginationProps<TData>) {
  const t = useTranslations<NextIntl.Namespace<'Component.table'>>('Component.table');
  const hasNextPage = page < totalPages;

  const limitDropdown: DispDropdownMenuProps[] = useMemo(() => {
    return [5, 10, 20, 40].map((item) => ({
      key: item.toString(),
      label: item.toString(),
      onClick: () => {
        setPage(1);
        setLimit(item);
      },
    }));
  }, [setLimit, setPage]);

  return (
    <div className="flex items-center justify-end space-x-2 py-4">
      <div className="flex items-center gap-2 mr-6">
        <p className="text-[13px]">{t('record')}</p>
        <DispDropdown label={t('record')} menu={limitDropdown}>
          <Button variant="outline" className="h-9 px-3 flex items-center gap-4">
            <span className="text-[13px]">{limit}</span>
            <span className="sr-only">Open menu</span>
            <ChevronsUpDown className="h-3 w-3" />
          </Button>
        </DispDropdown>
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setPage(page - 1);
        }}
        disabled={page <= 1}
        className="flex items-center gap-2 text-[12px]"
      >
        <MoveLeft className="w-2.5" />
        {t('previous')}
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => {
          setPage(page + 1);
        }}
        disabled={!hasNextPage}
        className="flex items-center gap-2 text-[12px]"
      >
        {t('next')}
        <MoveRight className="w-2.5" />
      </Button>
    </div>
  );
}
