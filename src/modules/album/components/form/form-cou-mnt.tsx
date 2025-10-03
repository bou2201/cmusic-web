'use client';

import { ApiReturnList, DialogState } from '~types/common';
import { Album, useAlbumCouMntSchema, UseAlbumCouMntSchemaType } from '../../types';
import {
  Combobox,
  DatePicker,
  DispDialog,
  InputCheckbox,
  InputText,
  InputTextarea,
  UploadImage,
} from '@/components/common';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { Button, Form } from '@/components/ui';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { albumService } from '../../service';
import { toast } from 'sonner';
import { getChangedFields } from '@/utiils/function';
import { useFetchArtist } from '@/modules/song/hooks';
import { songService } from '@/modules/song';

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

  const { data: dataArtist, isLoading: isLoadingArtist } = useFetchArtist();

  const form = useForm<UseAlbumCouMntSchemaType>({
    resolver: zodResolver(schema),
    values: {
      isFeatured: album?.isFeatured ?? false,
      title: album?.title ?? '',
      description: album?.description ?? undefined,
      releaseDate: album?.releaseDate ?? undefined,
      cover: album?.cover ?? undefined,
      isPublic: album?.isPublic ?? true,
      artistId: album?.artistId ?? '',
      songIds: album?.songs?.map((song) => song.id) ?? [],
    },
  });

  const watchArtistId = form.watch('artistId');

  console.log(form.watch());

  const { data: songs, isLoading: isLoadingSongs } = useQuery({
    queryKey: ['albums-songs', watchArtistId ?? album?.artistId],
    queryFn: () =>
      songService.getListSong({ page: 1, limit: 100, artistId: watchArtistId ?? album?.artistId }),
    enabled: !!(watchArtistId || album?.artistId),
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
      className="sm:max-w-3xl"
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
                songIds: album.songs?.map((song) => song.id) ?? [],
              };
              payload = getChangedFields(original, data);
            }
            return executeSubmit(payload);
          })}
          className="flex flex-col gap-5 mt-2"
        >
          <div className="grid grid-cols-2 gap-6 items-baseline">
            <UploadImage<UseAlbumCouMntSchemaType>
              className="col-span-2"
              name="cover"
              label={t('cover')}
            />

            <InputText<UseAlbumCouMntSchemaType>
              className="col-span-1"
              label={t('name')}
              name="title"
              inputProps={{
                placeholder: t('name'),
              }}
              required
              isDebounce
              debounceDelay={300}
            />

            <Combobox<UseAlbumCouMntSchemaType>
              name="artistId"
              label={t('artist')}
              className="col-span-1"
              options={dataArtist?.data ?? []}
              optionLabel="name"
              optionValue="id"
              isLoading={isLoadingArtist}
              placeholder={t('artist')}
              required
            />

            <DatePicker<UseAlbumCouMntSchemaType>
              name="releaseDate"
              label={t('releaseDate')}
              className="col-span-1"
            />

            <Combobox<UseAlbumCouMntSchemaType>
              name="songIds"
              label={t('songs')}
              isLoading={isLoadingSongs}
              className="col-span-1"
              options={songs?.data ?? []}
              optionLabel="title"
              optionValue="id"
              placeholder={t('songs')}
              mode="multiple"
            />

            {/* {album ? (
              <>
                <DatePicker name="createdAt" label={t('createdAt')} className="col-span-1"  />
                <DatePicker name="updatedAt" label={t('updatedAt')} className="col-span-1" />
              </>
            ) : null} */}

            <InputTextarea<UseAlbumCouMntSchemaType>
              className="col-span-2"
              label={t('description')}
              name="description"
              isDebounce
              debounceDelay={500}
              textareaProps={{
                placeholder: t('description'),
              }}
            />

            <InputCheckbox<UseAlbumCouMntSchemaType>
              label={t('featured')}
              name="isFeatured"
              className="col-span-1"
            />

            <InputCheckbox<UseAlbumCouMntSchemaType>
              label={t('isPublic')}
              name="isPublic"
              className="col-span-1"
            />
          </div>

          <div className="flex justify-end mt-5">
            <Button
              variant="primary"
              size="lg"
              className="font-semibold text-base"
              type="submit"
              isLoading={isLoadingSubmit}
              // disabled={!form.formState.isDirty}
            >
              {t('save')}
            </Button>
          </div>
        </form>
      </Form>
    </DispDialog>
  );
}
