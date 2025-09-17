'use client';

import { DispEmpty, SectionBanner, SectionSong } from '@/components/common';
import { Song, songService } from '@/modules/song';
import { useInfiniteQuery } from '@tanstack/react-query';
import { Loader2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { ApiReturnList } from '~types/common';
import { NextIntl } from '~types/next-intl';

export function PageDetails({ id }: { id: string }) {
  const t = useTranslations<NextIntl.Namespace<'GenrePage.genre'>>('GenrePage.genre');

  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error, isSuccess } =
    useInfiniteQuery({
      queryKey: ['genres-details', id],
      queryFn: ({ pageParam }) =>
        songService.getListSong({ page: pageParam ?? 1, limit: 20, genreId: id }),
      initialPageParam: 1,
      getNextPageParam: (lastPage: ApiReturnList<Song>) => {
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
            page.data?.map((song) => <SectionSong song={song} size="large" key={song.id} />),
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
