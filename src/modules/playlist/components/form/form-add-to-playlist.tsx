'use client';

import { DispDialog } from '@/components/common';
import { useTranslations } from 'next-intl';
import { DialogState } from '~types/common';
import { NextIntl } from '~types/next-intl';
import { useInView } from 'react-intersection-observer';
import { usePlaylistInfinite } from '../../hooks';
import { useEffect, useState } from 'react';
import { Loader2Icon } from 'lucide-react';
import Image from 'next/image';
import { useAuthStore } from '@/modules/auth';
import { Checkbox } from '@/components/ui';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { playlistService } from '../../service';
import { toast } from 'sonner';
import { IMAGE_PLACEHOLDER } from '@/constants/link';

type FormAddToPlaylistProps = {
  songId: string;
} & DialogState;

export function FormAddToPlaylist({ songId, open, setOpen }: FormAddToPlaylistProps) {
  const [pendingPlaylistId, setPendingPlaylistId] = useState<string | null>(null);

  const t = useTranslations<NextIntl.Namespace<'Component.playlist'>>('Component.playlist');
  const user = useAuthStore((state) => state.user);
  const queryClient = useQueryClient();

  const { ref, inView } = useInView();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, error, isSuccess } =
    usePlaylistInfinite();

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const { mutate: executeAdd, isPending: isAddPending } = useMutation({
    mutationFn: ({ playlistId, songId }: { playlistId: string; songId: string }) =>
      playlistService.addSongToPlaylist(playlistId, songId),
    onSuccess: () => {
      toast.success(t('addToPlaylistSuccess'));
      setOpen(false);

      queryClient.invalidateQueries({
        queryKey: ['playlist-user'],
      });
    },
    onError: () => {
      toast.error(t('addToPlaylistFailed'));
    },
  });

  const { mutate: executeRemove, isPending: isRemovePending } = useMutation({
    mutationFn: ({ playlistId, songId }: { playlistId: string; songId: string }) =>
      playlistService.removeSongFromPlaylist(playlistId, songId),
    onSuccess: () => {
      toast.success(t('removeFromPlaylistSuccess'));

      queryClient.invalidateQueries({
        queryKey: ['playlist-user'],
      });
    },
    onError: () => {
      toast.error(t('removeFromPlaylistFailed'));
    },
  });

  return (
    <DispDialog open={open} title={t('addToPlaylist')} setOpen={setOpen}>
      {isSuccess && (
        <div className="flex flex-col gap-2 mt-4">
          {data.pages.map((page) =>
            page.data?.map((playlist) => {
              const isAlreadyAdded = playlist.songAddedIds?.includes(songId);

              const handleClick = (playlistId: string) => {
                setPendingPlaylistId(playlistId);

                if (playlist.songAddedIds?.includes(songId)) {
                  executeRemove(
                    { playlistId, songId },
                    {
                      onSettled: () => {
                        setPendingPlaylistId(null);
                      },
                    },
                  );
                } else {
                  executeAdd(
                    { playlistId, songId },
                    {
                      onSettled: () => {
                        setPendingPlaylistId(null);
                      },
                    },
                  );
                }
              };

              return (
                <div
                  className="flex items-center justify-between gap-3 py-2 rounded-md cursor-pointer transition-all"
                  key={playlist.id}
                  onClick={() => {
                    handleClick(playlist.id);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10">
                      <Image
                        alt={playlist.title}
                        src={playlist.songs?.[0]?.cover?.url ?? playlist.cover ?? IMAGE_PLACEHOLDER}
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

                  {pendingPlaylistId === playlist.id ? (
                    <Loader2Icon className="animate-spin" />
                  ) : (
                    <Checkbox
                      className="cursor-pointer"
                      checked={isAlreadyAdded}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClick(playlist.id);
                      }}
                    />
                  )}
                </div>
              );
            }),
          )}

          <div ref={ref}>
            {isFetchingNextPage ? (
              <div className="flex items-center justify-start gap-4">
                <Loader2Icon className="animate-spin" />
              </div>
            ) : null}
          </div>
        </div>
      )}
    </DispDialog>
  );
}
