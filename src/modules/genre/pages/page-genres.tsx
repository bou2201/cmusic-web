'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useInView } from 'react-intersection-observer';
import { NextIntl } from '~types/next-intl';
import { genreService } from '../service';
import { ApiReturnList } from '~types/common';
import { useEffect } from 'react';
import { DispEmpty, SectionBanner, SectionGenre, SectionSongSkeleton } from '@/components/common';
import { Genre } from '../types';
import { Loader2Icon } from 'lucide-react';

export function PageGenres() {
  const t = useTranslations<NextIntl.Namespace<'GenrePage.genre'>>('GenrePage.genre');

  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error, isSuccess } =
    useInfiniteQuery({
      queryKey: ['genres'],
      queryFn: ({ pageParam }) => genreService.getListGenre({ page: pageParam ?? 1, limit: 10 }),
      initialPageParam: 1,
      getNextPageParam: (lastPage: ApiReturnList<Genre>) => {
        const { page, totalPages } = lastPage.meta;
        return page < totalPages ? page + 1 : undefined;
      },
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <SectionBanner isViewAll={false} isCarousel={false} title={t('title')}>
      {isLoading ? (
        <div className="flex items-center justify-center py-10 gap-4">
          <Loader2Icon className="animate-spin w-14 h-14" />
        </div>
      ) : null}

      {isSuccess && data.pages.some((page) => (page.data?.length ?? 0) > 0) && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {data.pages.map((page) =>
            page.data?.map((genre) => <SectionGenre genre={genre} key={genre.id} />),
          )}
        </div>
      )}

      {isSuccess && data.pages.every((page) => (page.data?.length ?? 0) === 0) && <DispEmpty />}

      <div ref={ref}>
        {isFetchingNextPage ? (
          <div className="flex items-center justify-center py-10 gap-4">
            <Loader2Icon className="animate-spin w-14 h-14" />
          </div>
        ) : null}
      </div>
    </SectionBanner>
  );
}
