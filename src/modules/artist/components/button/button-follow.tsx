'use client';

import { Button } from '@/components/ui';
import { AuthLogin, useAuthStore } from '@/modules/auth';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, Plus } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { NextIntl } from '~types/next-intl';
import { useFollowedArtists } from '../../hooks';
import { artistService } from '../../service';
import { toast } from 'sonner';

export function ButtonFollow({ artistId }: { artistId: string }) {
  const [openLogin, setOpenLogin] = useState<boolean>(false);
  const tSectionArt = useTranslations<NextIntl.Namespace<'Section.artist'>>('Section.artist');
  const queryClient = useQueryClient();
  const { data: followers } = useFollowedArtists();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const isFollowed = followers?.map((data) => data.id).includes(artistId);

  const { mutate: followOrUnfollow, isPending } = useMutation({
    mutationFn: (id: string) => artistService.followOrUnfollow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['followed-artist'] });
      if (isFollowed) {
        toast.success(tSectionArt('unfollowSuccess'));
      } else {
        toast.success(tSectionArt('followSuccess'));
      }
    },
    onError: () => {
      if (isFollowed) {
        toast.error(tSectionArt('unfollowFailed'));
      } else {
        toast.error(tSectionArt('followFailed'));
      }
    },
  });

  return (
    <>
      <Button
        variant="primary"
        className="font-bold"
        onClick={() => (isAuthenticated ? followOrUnfollow(artistId) : setOpenLogin(true))}
        disabled={isPending}
      >
        {!isFollowed ? (
          <>
            <Plus /> {tSectionArt('follow')}
          </>
        ) : (
          <>
            <Check /> {tSectionArt('unfollow')}
          </>
        )}
      </Button>

      {openLogin ? <AuthLogin open={openLogin} setOpen={setOpenLogin} /> : null}
    </>
  );
}
