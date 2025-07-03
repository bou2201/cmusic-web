'use client';

import { Combobox, InputText, InputTextarea, SectionMnt } from '@/components/common';
import { Form } from '@/components/ui';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { NextIntl } from '~types/next-intl';
import { useFetchArtist, useFetchGenre } from '../../hooks';

const useSongCouMntSchema = () => {
  const t = useTranslations<NextIntl.Namespace<'Validation'>>('Validation');

  const schema = z.object({
    title: z.string({ message: t('common.required') }).min(1, { message: t('common.required') }),
    cover: z.any().nullable(),
    duration: z.coerce.number(),
    audioUrl: z.string(),
    audioPublicId: z.string(),
    artistId: z.string(),
    lyrics: z.string().optional(),
    featuredArtistIds: z.array(z.string()).default([]),
    genreIds: z.array(z.string()).default([]),
    albumId: z.string(),
    isExplicit: z.boolean().default(false),
    isPublic: z.boolean().default(true),
  });

  return schema;
};

type UseSongCouMntSchemaType = z.infer<ReturnType<typeof useSongCouMntSchema>>;

export function FormCouMnt({ id }: { id?: string }) {
  const t = useTranslations<NextIntl.Namespace<'SongsPage.songMnt.createOrUpdate'>>(
    'SongsPage.songMnt.createOrUpdate',
  );
  const schema = useSongCouMntSchema();

  const form = useForm<UseSongCouMntSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {},
  });

  const { data: dataArtist, isLoading: isLoadingArtist } = useFetchArtist();
  const { data: dataGenre, isLoading: isLoadingGenre } = useFetchGenre();

  return (
    <SectionMnt title={id ? t('update') : t('add')}>
      <Form {...form}>
        <form id={id ? `form-cou-mnt-update-${id}` : 'form-cou-mnt-create'}>
          <div className="grid grid-cols-2 gap-10">
            <div className="col-span-1">
              <div className="grid grid-cols-2 gap-6 items-baseline">
                <InputText<UseSongCouMntSchemaType>
                  className="col-span-1"
                  label={t('title')}
                  name="title"
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
                />
                <Combobox<UseSongCouMntSchemaType>
                  name="featuredArtistIds"
                  label={t('featArtists')}
                  className="col-span-1"
                  options={dataArtist?.data ?? []}
                  optionLabel="name"
                  optionValue="id"
                  isLoading={isLoadingArtist}
                  placeholder={t('featArtists')}
                  mode="multiple"
                />
                <InputTextarea<UseSongCouMntSchemaType>
                  label={t('lyrics')}
                  name="lyrics"
                  className="col-span-2"
                  isDebounce
                  debounceDelay={500}
                  textareaProps={{
                    placeholder: t('lyrics'),
                  }}
                />
              </div>
            </div>

            <div className="col-span-1"></div>
          </div>
        </form>
      </Form>
    </SectionMnt>
  );
}
