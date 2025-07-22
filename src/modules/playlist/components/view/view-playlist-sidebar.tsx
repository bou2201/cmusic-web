'use client';

import { useInView } from 'react-intersection-observer';
import { usePlaylistInfinite } from '../../hooks';
import { useEffect } from 'react';
import Image from 'next/image';
import { Loader2Icon } from 'lucide-react';
import { useAuthStore } from '@/modules/auth';

export function ViewPlaylistSidebar() {
  const { ref, inView } = useInView();
  const user = useAuthStore((state) => state.user);

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
          page.data?.map((playlist) => (
            <div
              className="flex items-center gap-3 p-1 rounded-md cursor-pointer transition-all hover:bg-neutral-800"
              key={playlist.id}
            >
              <div className="w-10 h-10">
                <Image
                  alt={playlist.title}
                  src={playlist.cover ?? '/images/song-default-white.png'}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold">{playlist.title}</span>
                <span className="text-xs text-[#a5a5a5]">
                  {playlist.userId === user?.id ? user.name : ''}
                </span>
              </div>
            </div>
          )),
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
