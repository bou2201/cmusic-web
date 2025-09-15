import { useAuthStore } from '@/modules/auth';
import { useQuery } from '@tanstack/react-query';
import { artistService } from '../service';

export const useFollowedArtists = () => {
  const token = useAuthStore((state) => state);

  return useQuery({
    queryKey: ['followed-artist'],
    queryFn: () => artistService.getArtistsFollowed(),
    enabled: !!token,
  });
};
