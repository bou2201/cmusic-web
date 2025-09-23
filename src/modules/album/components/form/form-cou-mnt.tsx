'use client';

import { DialogState } from '~types/common';
import { Album, useAlbumCouMntSchema, UseAlbumCouMntSchemaType } from '../../types';
import { DispDialog, InputCheckbox, InputText, InputTextarea } from '@/components/common';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { Button, Form } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { albumService } from '../../service';
import { toast } from 'sonner';
import { getChangedFields } from '@/utiils/function';

type FormCouMntProps = DialogState & {
  album?: Album;
  setAlbum?: (album?: Album) => void;
};

export function FormCouMnt({ open, setOpen, album, setAlbum }: FormCouMntProps) {
  const t = useTranslations<NextIntl.Namespace<'AlbumsPage.albumMnt.createOrUpdate'>>(
    'AlbumsPage.albumMnt.createOrUpdate',
  );
  const schema = useAlbumCouMntSchema();
  const queryClient = useQueryClient();

  const form = useForm<UseAlbumCouMntSchemaType>({
    resolver: zodResolver(schema),
    values: {
      isFeatured: album?.isFeatured ?? false,
      title: album?.title ?? '',
      description: album?.description ?? undefined,
      releaseDate: album?.releaseDate ?? undefined,
      cover: album?.cover ?? undefined,
      isPublic: album?.isPublic ?? false,
      artistId: album?.artistId ?? '',
    },
  });

  const { mutate: executeSubmit, isPending: isLoadingSubmit } = useMutation({
    mutationFn: (data: Partial<UseAlbumCouMntSchemaType>) =>
      album
        ? albumService.updateAlbum(album.id, data)
        : albumService.createAlbum(data as UseAlbumCouMntSchemaType),
    onSuccess: () => {
      if (album) {
        toast.success(t('updateSuccess'));
      } else {
        toast.success(t('addSuccess'));
      }

      queryClient.invalidateQueries({ queryKey: ['albums-mnt'] });
      setOpen(false);
      if (album && setAlbum) setAlbum(undefined);
    },
    onError: (error) => {
      console.log(error);
      if (album) {
        toast.error(t('updateFailed'));
      } else {
        toast.error(t('addFailed'));
      }
    },
  });

  return (
    <DispDialog
      open={open}
      setOpen={(open) => {
        setOpen(open);
        if (!open && album && setAlbum) {
          setAlbum(undefined);
        }
      }}
      title={album ? t('update') : t('add')}
      className="sm:max-w-2xl"
    >
      <Form {...form}>
        <form
          id={album ? `form-album-cou-mnt-update-${album.id}` : 'form-album-cou-mnt-create'}
          onSubmit={form.handleSubmit((data) => {
            let payload: Partial<UseAlbumCouMntSchemaType> = data;

            if (album) {
              const original = {
                isFeatured: album.isFeatured,
                title: album.title,
                description: album.description,
                releaseDate: album.releaseDate,
                cover: album.cover,
                isPublic: album.isPublic,
                artistId: album.artistId,
              };
              payload = getChangedFields(original, data);
            }
            return executeSubmit(payload);
          })}
          className="flex flex-col gap-5 mt-2"
        >
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
