'use client';

import { DispAlertDialog } from '@/components/common';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { DialogState } from '~types/common';
import { NextIntl } from '~types/next-intl';
import { albumService } from '../../service';
import { toast } from 'sonner';

export function FormAlertDelete({ open, setOpen, id }: DialogState & { id: string }) {
  const t = useTranslations<NextIntl.Namespace<'AlbumsPage.albumMnt.delete'>>(
    'AlbumsPage.albumMnt.delete',
  );
  const queryClient = useQueryClient();

  const { mutate: execute, isPending } = useMutation({
    mutationFn: () => albumService.deleteAlbum(id),
    onSuccess: () => {
      toast.success(t('successDelete'));

      queryClient.invalidateQueries({ queryKey: ['albums-mnt'] });
      setOpen(false);
    },
    onError: (error) => {
      console.log(error);
      toast.error(t('failureDelete'));
    },
  });

  return (
    <DispAlertDialog
      open={open}
      setOpen={setOpen}
      title={t('titleDelete')}
      description={
        <div className="flex items-center gap-1">
          <span>{t('confirmDelete')}</span>
        </div>
      }
      isPending={isPending}
      onConfirm={execute}
    />
  );
}
