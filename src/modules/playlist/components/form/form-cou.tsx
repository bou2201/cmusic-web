'use client';

import { DialogState } from '~types/common';
import { Playlist, usePlaylistCou, UsePlaylistCouSchema } from '../../types';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button, Form } from '@/components/ui';
import { DispDialog, InputText, UploadImage } from '@/components/common';
import { playlistService } from '../../service';
import { toast } from 'sonner';

type FormCouPlaylistProps = DialogState & {
  playlist?: Playlist;
  setPlaylist?: (playlist?: Playlist) => void;
};

export function FormCouPlaylist({ open, setOpen, playlist, setPlaylist }: FormCouPlaylistProps) {
  const t = useTranslations<NextIntl.Namespace<'Component.playlist'>>('Component.playlist');
  const schema = usePlaylistCou();
  const queryClient = useQueryClient();

  const form = useForm<UsePlaylistCouSchema>({
    resolver: zodResolver(schema),
    values: {
      title: playlist?.title ?? '',
      cover: playlist?.cover ?? undefined,
    },
  });

  const { mutate: executeSubmit, isPending: isLoadingSubmit } = useMutation({
    mutationFn: (data: UsePlaylistCouSchema) =>
      playlist
        ? playlistService.updatePlaylist(playlist.id, data)
        : playlistService.createPlaylist(data),
    onSuccess: () => {
      if (playlist) {
        toast.success(t('updateSuccess'));
      } else {
        toast.success(t('createSuccess'));
      }

      queryClient.invalidateQueries({ queryKey: ['playlist-user'] });
      setOpen(false);
      if (playlist && setPlaylist) setPlaylist(undefined);
    },
    onError: (error) => {
      console.log(error);
      if (playlist) {
        toast.error(t('updateFailed'));
      } else {
        toast.error(t('createFailed'));
      }
    },
  });

  return (
    <DispDialog
      open={open}
      setOpen={(open) => {
        setOpen(open);
        if (!open && playlist && setPlaylist) {
          setPlaylist(undefined);
        }
      }}
      title={playlist ? t('update') : t('create')}
    >
      <Form {...form}>
        <form
          id={playlist ? `form-playlist-cou-update-${playlist.id}` : 'form-playlist-cou-create'}
          onSubmit={form.handleSubmit((data) => {
            return executeSubmit(data);
          })}
          className="flex flex-col gap-5 mt-2"
        >
          <UploadImage<UsePlaylistCouSchema> name="cover" label={t('cover')} />

          <InputText<UsePlaylistCouSchema>
            label={t('title')}
            name="title"
            inputProps={{
              placeholder: t('title'),
            }}
            required
          />

          <div className="flex justify-end mt-5">
            <Button
              variant="primary"
              size="lg"
              className="font-semibold text-base"
              type="submit"
              isLoading={isLoadingSubmit}
              disabled={!form.formState.isDirty}
            >
              {t('save')}
            </Button>
          </div>
        </form>
      </Form>
    </DispDialog>
  );
}
