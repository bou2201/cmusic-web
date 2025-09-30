'use client';

import { artistService } from '@/modules/artist';
import { genreService } from '@/modules/genre';
import { useQuery } from '@tanstack/react-query';

export const useFetchArtist = () => {
  return useQuery({
    queryKey: ['mnt', 'artist'],
    queryFn: () => artistService.getListArtist({ page: 1, limit: 1000 }),
  });
};

export const useFetchGenre = () => {
  return useQuery({
    queryKey: ['mnt', 'genre'],
    queryFn: () => genreService.getListGenre({ page: 1, limit: 1000 }),
  });
};
