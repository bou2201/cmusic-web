import { DispAlertDialog } from '@/components/common';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { DialogState } from '~types/common';
import { NextIntl } from '~types/next-intl';
import { playlistService } from '../../service';
import { Playlist } from '../../types';
import { toast } from 'sonner';
import { useRouter } from '@/i18n/navigation';
import { Routes } from '@/constants/routes';

export function FormDialogRemove({
  open,
  setOpen,
  playlist,
}: DialogState & { playlist: Playlist }) {
  const t = useTranslations<NextIntl.Namespace<'Component.playlist'>>('Component.playlist');
  const queryClient = useQueryClient();
  const router = useRouter();

  const { mutate: execute, isPending } = useMutation({
    mutationFn: () => playlistService.deletePlaylist(playlist.id),
    onSuccess: () => {
      toast.success(t('deleteSuccess'));

      queryClient.invalidateQueries({ queryKey: ['playlist-user'] });
      router.push(Routes.Discover);
      setOpen(false);
    },
    onError: (error) => {
      console.log(error);
      toast.error(t('deleteFailed'));
    },
  });

  return (
    <DispAlertDialog
      open={open}
      setOpen={setOpen}
      title={t('delete')}
      description={
        <div className="flex items-center gap-1">
          <span>{t('deleteDesc')}</span>
          <b>{playlist.title}</b>
        </div>
      }
      isPending={isPending}
      onConfirm={execute}
    />
  );
}
