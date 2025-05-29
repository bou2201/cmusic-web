'use client';

import { Button } from '@/components/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { songService } from '../../service';
import { memo } from 'react';
import { Song } from '../../types';
import { useSongStore } from '../../store';

export const BtnLikeSong = memo(
  ({ size = 'small', songId }: { size?: 'small' | 'large'; songId: string }) => {
    const { track, setTrack } = useSongStore((state) => state);

    const queryClient = useQueryClient();

    const songDetails = queryClient.getQueryData<Song>(['song-details', songId]);
    const isLiked = songDetails?.isLiked ?? false;

    const { mutate: executeToggle, isPending } = useMutation({
      mutationFn: () => songService.toggleLike(songId as string),
      onSuccess: (data) => {
        queryClient.setQueryData(['song-details', songId], (oldData: Song) => ({
          ...oldData,
          isLiked: data.isLiked,
        }));

        if (track?.id === songId) {
          setTrack({
            ...track,
            isLiked: data.isLiked,
          });
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['song-details', songId] });
      },
    });

    return (
      <Button
        variant="ghost"
        size="icon"
        className={`shrink-0 rounded-full ${size === 'large' ? 'w-12 h-12' : ''}`}
        style={{ cursor: isPending ? 'wait' : 'pointer' }}
        onClick={() => {
          executeToggle();
        }}
        disabled={isPending}
      >
        <Heart
          className={`${isLiked ? 'fill-primary-pink stroke-primary-pink' : ''} ${size === 'large' ? '!w-6 !h-6 opacity-80' : ''}`}
        />
      </Button>
    );
  },
);
BtnLikeSong.displayName = 'BtnLikeSong';
