import { useQuery } from '@tanstack/react-query';
import { playlistService } from '../service';

export const usePlaylistDetails = (id: string | undefined) => {
  return useQuery({
    queryKey: ['playlist-user-details', id],
    queryFn: () => playlistService.getPlaylistById(id as string),
    enabled: !!id,
  });
};
