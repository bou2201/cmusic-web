'use client';

import { useInView } from 'react-intersection-observer';
import { usePlaylistInfinite } from '../../hooks';
import { useEffect } from 'react';
import { Loader2Icon } from 'lucide-react';
import { ViewPlaylistItem } from './view-playlist-item';

export function ViewPlaylistSidebar() {
  const { ref, inView } = useInView();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error, isSuccess } =
    usePlaylistInfinite();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    isSuccess && (
      <div className="flex flex-col gap-2">
        {data.pages.map((page) =>
          page.data?.map((playlist) => <ViewPlaylistItem playlist={playlist} key={playlist.id} />),
        )}

        <div ref={ref}>
          {isFetchingNextPage ? (
            <div className="flex items-center justify-start gap-4">
              <Loader2Icon className="animate-spin" />
            </div>
          ) : null}
        </div>
      </div>
    )
  );
}
