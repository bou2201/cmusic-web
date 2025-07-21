import { useInfiniteQuery } from '@tanstack/react-query';
import { playlistService } from '../service';
import { ApiReturnList } from '~types/common';
import { Playlist } from '../types';
import { useAuthStore } from '@/modules/auth';

export const usePlaylistInfinite = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useInfiniteQuery({
    queryKey: ['playlist-user'],
    queryFn: ({ pageParam }) =>
      playlistService.getListPlaylist({ page: pageParam ?? 1, limit: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage: ApiReturnList<Playlist>) => {
      const { page, totalPages } = lastPage.meta;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!isAuthenticated,
  });
};
