'use client';

import {
  Button,
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
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
import { ChevronsUpDown, Loader2 } from 'lucide-react';
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
  onRowMouseEnter?: (rowIndex: number) => void;
  onRowMouseLeave?: () => void;
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
  onRowMouseEnter,
  onRowMouseLeave,
}: DispTableProps<TData, TValue>) {
  'use no memo';

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
        <Table className={`relative ${cnTable}`} suppressHydrationWarning>
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
                          textAlign:
                            (header.column.columnDef.meta as any)?.style?.textAlign ?? 'left',
                        }}
                        className="font-bold"
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
          <TableBody className={cnTableBody}>
            {table?.getRowModel?.().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  className={cnTableRow}
                  onMouseEnter={() => onRowMouseEnter?.(row.index)}
                  onMouseLeave={onRowMouseLeave}
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
                  {!isLoading && <DispEmpty title={titleNoResult} />}
                </TableCell>
              </TableRow>
            )}
          </TableBody>

          {isLoading ? <DispTableLoadingProgress /> : null}
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

function DispTableLoadingProgress() {
  return (
    <div className="absolute pt-12 z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-full h-full flex justify-center items-center bg-transparent pointer-events-none">
      <Loader2 className="animate-spin w-12 h-12" />
    </div>
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

  const pageItems = useMemo(() => {
    const pages: number[] = [];
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    const items = pages.map((p) => (
      <PaginationItem key={p}>
        <PaginationLink
          isActive={p === page}
          onClick={(e) => {
            e.preventDefault();
            setPage(p);
          }}
        >
          {p}
        </PaginationLink>
      </PaginationItem>
    ));

    if (startPage > 1) {
      items.unshift(
        <PaginationItem key="start-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>,
      );
      items.unshift(
        <PaginationItem key={1}>
          <PaginationLink
            isActive={page === 1}
            onClick={(e) => {
              e.preventDefault();
              setPage(1);
            }}
          >
            1
          </PaginationLink>
        </PaginationItem>,
      );
    }

    if (endPage < totalPages) {
      items.push(
        <PaginationItem key="end-ellipsis">
          <PaginationEllipsis />
        </PaginationItem>,
      );
      items.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            isActive={page === totalPages}
            onClick={(e) => {
              e.preventDefault();
              setPage(totalPages);
            }}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>,
      );
    }

    return items;
  }, [page, totalPages, setPage]);

  return (
    <div className="flex items-center justify-between space-x-2 py-4">
      <div className="flex items-center gap-2 mr-6">
        <p className="text-[13px] whitespace-nowrap font-medium">{t('record')}</p>
        <DispDropdown label={t('record')} menu={limitDropdown}>
          <Button variant="outline" className="h-9 px-3 flex items-center gap-4">
            <span className="text-[13px]">{limit}</span>
            <span className="sr-only">Open menu</span>
            <ChevronsUpDown className="h-3 w-3" />
          </Button>
        </DispDropdown>
        <span className="text-[13px] whitespace-nowrap opacity-70">
          {t('total')}: {total}
        </span>
      </div>

      {totalPages > 0 && (
        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) setPage(page - 1);
                }}
                title={t('previous')}
              />
            </PaginationItem>

            {pageItems}

            <PaginationItem>
              <PaginationNext
                onClick={(e) => {
                  e.preventDefault();
                  if (page < totalPages) setPage(page + 1);
                }}
                title={t('next')}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
