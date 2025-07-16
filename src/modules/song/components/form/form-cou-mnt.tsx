'use client';

import {
  Combobox,
  InputCheckbox,
  InputText,
  InputTextarea,
  SectionMnt,
  UploadAudio,
  UploadImage,
} from '@/components/common';
import { Button, Form } from '@/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { NextIntl } from '~types/next-intl';
import { useFetchArtist, useFetchGenre } from '../../hooks';
import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { songService } from '../../service';
import { useSongCouMntSchema, UseSongCouMntSchemaType } from '../../types';
import { useRouter } from '@/i18n/navigation';
import { toast } from 'sonner';
import { Routes } from '@/constants/routes';

export function FormCouMnt({ id }: { id?: string }) {
  const t = useTranslations<NextIntl.Namespace<'SongsPage.songMnt.createOrUpdate'>>(
    'SongsPage.songMnt.createOrUpdate',
  );
  const schema = useSongCouMntSchema();
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data: dataArtist, isLoading: isLoadingArtist } = useFetchArtist();
  const { data: dataGenre, isLoading: isLoadingGenre } = useFetchGenre();
  const { data: dataDetails } = useQuery({
    queryKey: ['songs-mnt', id],
    queryFn: () => songService.getSongById(id!),
    enabled: !!id,
  });

  const form = useForm<UseSongCouMntSchemaType>({
    resolver: zodResolver(schema),
    values: {
      isExplicit: dataDetails?.isExplicit ?? false,
      isPublic: dataDetails?.isPublic ?? true,
      title: dataDetails?.title ?? '',
      lyrics: dataDetails?.lyrics ?? '',
      genreIds: dataDetails?.genres.map((item) => item.id) ?? [],
      featuredArtistIds: dataDetails?.artists.map((item) => item.id) ?? [],
      albumId: dataDetails?.albumId ?? null,
      artistId: dataDetails?.artistId ?? '',
      audioUrl: dataDetails?.audioUrl ?? '',
      audioPublicId: dataDetails?.audioPublicId ?? '',
      cover: dataDetails?.cover ?? undefined,
      duration: dataDetails?.duration ?? 0,
    },
  });

  const artistId = form.watch('artistId');
  const featuredArtistIds = form.watch('featuredArtistIds');

  const { mutate: executeSubmit, isPending: isLoadingSubmit } = useMutation({
    mutationFn: (data: UseSongCouMntSchemaType) =>
      id ? songService.updateSong(id, data) : songService.createSong(data),
    onSuccess: () => {
      if (id) {
        toast.success(t('updateSuccess'));
      } else {
        toast.success(t('addSuccess'));
      }

      queryClient.invalidateQueries({ queryKey: ['songs-mnt'] });
      router.push(Routes.AdminSongs);
    },
    onError: (error) => {
      console.log(error);

      if (id) {
        toast.error(t('updateFailed'));
      } else {
        toast.error(t('addFailed'));
      }
    },
  });

  // useEffect(() => {
  //   if (dataDetails) {
  //     form.reset({
  //       ...dataDetails,
  //       genreIds: dataDetails.genres.map((item) => item.id) ?? [],
  //       featuredArtistIds: dataDetails.artists.map((item) => item.id) ?? [],
  //       albumId: dataDetails.albumId ?? null,
  //     });
  //   }
  // }, [dataDetails, form]);

  useEffect(() => {
    if (!artistId) return;

    if (Array.isArray(featuredArtistIds) && featuredArtistIds.includes(artistId)) {
      const newFeatured = featuredArtistIds.filter((id) => id !== artistId);
      form.setValue('featuredArtistIds', newFeatured);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [artistId]);

  return (
    <SectionMnt title={id ? t('update') : t('add')}>
      <Form {...form}>
        <form
          id={id ? `form-song-cou-mnt-update-${id}` : 'form-song-cou-mnt-create'}
          onSubmit={form.handleSubmit((data) => executeSubmit(data))}
        >
          <div className="grid grid-cols-2 gap-14">
            <div className="col-span-1 max-md:col-span-2">
              <div className="grid grid-cols-2 gap-6 items-baseline">
                <InputText<UseSongCouMntSchemaType>
                  className="col-span-1"
                  label={t('title')}
                  name="title"
                  inputProps={{
                    placeholder: t('title'),
                  }}
                  required
                />

                <Combobox<UseSongCouMntSchemaType>
                  name="genreIds"
                  label={t('genre')}
                  className="col-span-1"
                  options={dataGenre?.data ?? []}
                  optionLabel="name"
                  optionValue="id"
                  isLoading={isLoadingGenre}
                  placeholder={t('genre')}
                  mode="multiple"
                  required
                />

                <Combobox<UseSongCouMntSchemaType>
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

                <Combobox<UseSongCouMntSchemaType>
                  name="featuredArtistIds"
                  label={t('featArtists')}
                  className="col-span-1"
                  options={(dataArtist?.data ?? []).filter((artist) => artist.id !== artistId)}
                  optionLabel="name"
                  optionValue="id"
                  isLoading={isLoadingArtist}
                  placeholder={t('featArtists')}
                  mode="multiple"
                />

                <Combobox<UseSongCouMntSchemaType>
                  name="albumId"
                  label={t('album')}
                  className="col-span-2"
                  options={[]}
                  placeholder={t('album')}
                />

                <InputTextarea<UseSongCouMntSchemaType>
                  label={t('lyrics')}
                  name="lyrics"
                  className="col-span-2"
                  isDebounce
                  debounceDelay={500}
                  textareaProps={{
                    placeholder: t('lyrics'),
                    className: 'h-64',
                  }}
                />

                <InputCheckbox<UseSongCouMntSchemaType>
                  name="isPublic"
                  label={t('isPublic')}
                  className="col-span-2"
                  description={t('isPublicDesc')}
                />
              </div>
            </div>

            <div className="col-span-1 max-md:col-span-2 gap-6 flex flex-col">
              <UploadImage<UseSongCouMntSchemaType> name="cover" label={t('cover')} />

              <UploadAudio<UseSongCouMntSchemaType>
                name="audioUrl"
                label={t('audio')}
                required
                description={t('descAudio')}
              />
            </div>
          </div>
          <div className="flex justify-end mt-10">
            <Button
              variant="primary"
              size="lg"
              className="font-semibold text-base"
              type="submit"
              isLoading={isLoadingSubmit}
            >
              {t('save')}
            </Button>
          </div>
        </form>
      </Form>
    </SectionMnt>
  );
}
