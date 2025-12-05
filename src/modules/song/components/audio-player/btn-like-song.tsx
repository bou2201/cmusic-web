'use client';

import { Button } from '@/components/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Heart } from 'lucide-react';
import { songService } from '../../service';
import { memo, useState } from 'react';
import { Song } from '../../types';
import { useSongStore } from '../../store';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { AuthLogin, useAuthStore } from '@/modules/auth';

const particles = ['💖', '❤️', '💖', '❤️'];

export const BtnLikeSong = memo(
  ({ size = 'small', songId }: { size?: 'small' | 'large'; songId: string }) => {
    const [showParticles, setShowParticles] = useState<boolean>(false);
    const [openLogin, setOpenLogin] = useState<boolean>(false);

    const { track, trackIsLiked, setTrackIsLiked } = useSongStore((state) => state);
    const { user } = useAuthStore((state) => state);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const queryClient = useQueryClient();

    const songDetails = queryClient.getQueryData<Song>(['song-details', songId]);
    const isLiked = user ? (songDetails?.isLiked ?? trackIsLiked ?? false) : false;

    const { mutate: executeToggle, isPending } = useMutation({
      mutationFn: () => songService.toggleLike(songId as string),
      onMutate: async () => {
        await queryClient.cancelQueries({ queryKey: ['song-details', songId] });

        const previousData = queryClient.getQueryData<Song>(['song-details', songId]);

        const optimisticData = {
          ...previousData!,
          isLiked: !previousData?.isLiked,
        };

        queryClient.setQueryData(['song-details', songId], optimisticData);

        // Trigger animation when toggled
        setShowParticles(true);
        setTimeout(() => {
          setShowParticles(false);
        }, 800);

        return { previousData };
      },
      onError: (err, variables, context: any) => {
        if (context?.previousData) {
          queryClient.setQueryData(['song-details', songId], context.previousData);
        }
        if (track?.id === songId && context?.previousData) {
          setTrackIsLiked(context.previousData.isLiked);
        }
      },
      onSuccess: (data) => {
        queryClient.setQueryData(['song-details', songId], (oldData: Song) => ({
          ...oldData,
          isLiked: data.isLiked,
        }));

        if (track?.id === songId) {
          setTrackIsLiked(data.isLiked);
        }
      },
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ['song-details', songId] });
      },
    });

    return (
      <>
        <div className="relative inline-block">
          <motion.button
            onClick={() => {
              if (isAuthenticated) {
                executeToggle();
              } else {
                setOpenLogin(true);
              }
            }}
            whileTap={{ scale: 1.2 }}
            className={cn(
              'relative shrink-0 z-10 flex items-center justify-center rounded-full bg-transparent transition',
              size === 'large' ? 'w-12 h-12' : 'w-9 h-9',
              isPending ? 'cursor-wait' : 'cursor-pointer',
            )}
            disabled={isPending}
          >
            <motion.div
              key={isLiked ? 'liked' : 'unliked'}
              initial={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              <Heart
                className={cn(
                  'w-6 h-6 transition-all',
                  isLiked && 'fill-primary-pink stroke-primary-pink',
                  size !== 'large' && '!w-5 !h-5',
                )}
              />
            </motion.div>
          </motion.button>

          {/* Emoji Particles */}
          <AnimatePresence>
            {showParticles &&
              particles.map((emoji, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 1, y: 0, scale: 1 }}
                  animate={{
                    y: -40 - index * 5,
                    x: (index - 2) * 20,
                    opacity: 0,
                    scale: 0.6,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className="absolute top-1/2 left-1/2 text-xl pointer-events-none"
                  style={{
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  {emoji}
                </motion.span>
              ))}
          </AnimatePresence>
        </div>

        {openLogin ? <AuthLogin open={openLogin} setOpen={setOpenLogin} /> : null}
      </>
    );
  },
);
BtnLikeSong.displayName = 'BtnLikeSong';
