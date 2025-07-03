'use client';

import { useForm } from 'react-hook-form';
import { SongFilter } from '../../types';
import { useSongStore } from '../../store';
import { Form } from '@/components/ui';
import { Combobox, InputText } from '@/components/common';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { artistService } from '@/modules/artist';
import { useFetchArtist } from '../../hooks';

export function FormFiltersMnt() {
  const t = useTranslations<NextIntl.Namespace<'SongsPage.songMnt'>>('SongsPage.songMnt');
  const filters = useSongStore((state) => state.filters);
  const setFilters = useSongStore((state) => state.setFilters);

  const filtersForm = useForm<Omit<SongFilter, 'page' | 'limit'>>({
    values: filters,
  });

  useEffect(() => {
    const subscription = filtersForm.watch((values) => {
      setFilters(values);
    });

    return () => subscription.unsubscribe();
  }, [filtersForm, filtersForm.watch, setFilters]);

  const { data: dataArtist, isLoading: isLoadingArtist } = useFetchArtist();

  return (
    <Form {...filtersForm}>
      <form id="form-filters-song-mnt" className="mb-5">
        <div className="grid grid-cols-4 gap-4">
          <InputText<SongFilter>
            name="search"
            className="col-span-1"
            debounceDelay={500}
            isDebounce
            inputProps={{
              placeholder: t('filters.search'),
            }}
          />

          <Combobox<SongFilter>
            name="artistId"
            className="col-span-1"
            options={[
              {
                id: '',
                name: t('filters.all'),
              },
              ...(dataArtist?.data ?? []),
            ]}
            placeholder={t('filters.artist')}
            optionLabel="name"
            optionValue="id"
            isLoading={isLoadingArtist}
          />
        </div>
      </form>
    </Form>
  );
}
