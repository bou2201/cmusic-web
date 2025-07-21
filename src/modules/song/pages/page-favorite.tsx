'use client';

import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import { songService } from '../service';
import { ApiReturnList } from '~types/common';
import { Song } from '../types';
import { useEffect } from 'react';
import { DispEmpty, SectionBanner, SectionSong, SectionSongSkeleton } from '@/components/common';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { useAuthStore } from '@/modules/auth';

export function PageFavorite() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const t = useTranslations<NextIntl.Namespace<'FavoriteSongsPage.section'>>(
    'FavoriteSongsPage.section',
  );

  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error, isSuccess } =
    useInfiniteQuery({
      queryKey: ['songs-favorite'],
      queryFn: ({ pageParam }) => songService.getSongsLiked({ page: pageParam ?? 1, limit: 10 }),
      initialPageParam: 1,
      getNextPageParam: (lastPage: ApiReturnList<Song>) => {
        const { page, totalPages } = lastPage.meta;
        return page < totalPages ? page + 1 : undefined;
      },
      enabled: !!isAuthenticated,
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <SectionBanner isViewAll={false} isCarousel={false} title={t('song')}>
      {isLoading ? (
        <div className="flex items-center justify-start gap-4">
          <SectionSongSkeleton quantity={3} />
        </div>
      ) : null}

      {isSuccess ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {data.pages.map((page) =>
            page.data?.map((song) => <SectionSong size="large" song={song} key={song.id} />),
          )}
        </div>
      ) : (
        <DispEmpty />
      )}

      <div ref={ref}>
        {isFetchingNextPage ? (
          <div className="flex items-center justify-start gap-4">
            <SectionSongSkeleton quantity={3} />
          </div>
        ) : null}
      </div>
    </SectionBanner>
  );
}
