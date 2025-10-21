'use client';

import { useForm } from 'react-hook-form';
import { SongFilter } from '../../types';
import { useSongStore } from '../../store';
import { Button, Form } from '@/components/ui';
import { Combobox, DispPopover, InputCheckbox, InputText } from '@/components/common';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { useEffect, useState } from 'react';
import { useFetchArtist } from '../../hooks';
import { FilterIcon } from 'lucide-react';

type FormFiltersMntProps = {
  setPage: (page: number) => void;
};

export function FormFiltersMnt({ setPage }: FormFiltersMntProps) {
  const [openMoreFilter, setOpenMoreFilter] = useState<boolean>(false);

  const t = useTranslations<NextIntl.Namespace<'SongsPage.songMnt'>>('SongsPage.songMnt');
  const filters = useSongStore((state) => state.filters);
  const setFilters = useSongStore((state) => state.setFilters);

  const filtersForm = useForm<Omit<SongFilter, 'page' | 'limit'>>({
    values: { ...filters, includeHidden: true },
  });

  useEffect(() => {
    const subscription = filtersForm.watch((values, { name }) => {
      if (name === 'artistId' || name === 'isTrending' || name === 'includeHidden') {
        setFilters(values);
        setPage(1);
      } else {
        setFilters(values);
      }
    });

    return () => subscription.unsubscribe();
  }, [filtersForm, filtersForm.watch, setFilters, setPage]);

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

          <DispPopover
            open={openMoreFilter}
            setOpen={setOpenMoreFilter}
            trigger={
              <Button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenMoreFilter(!openMoreFilter);
                }}
                variant="ghost"
                className="w-9 h-9"
              >
                <FilterIcon />
              </Button>
            }
          >
            <div className="space-y-4">
              <InputCheckbox<SongFilter> name="isTrending" label={t('filters.isTrending')} />
              <InputCheckbox<SongFilter> name="includeHidden" label={t('filters.isPublic')} />
            </div>
          </DispPopover>
        </div>
      </form>
    </Form>
  );
}
