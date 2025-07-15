'use client';

import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui';
import { InputText } from '@/components/common';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { useEffect } from 'react';
import { useArtistStore } from '../../store';
import { ArtistFilter } from '../../types';

export function FormFiltersMnt() {
  const t = useTranslations<NextIntl.Namespace<'ArtistPage.artistMnt'>>('ArtistPage.artistMnt');
  const filters = useArtistStore((state) => state.filters);
  const setFilters = useArtistStore((state) => state.setFilters);

  const filtersForm = useForm<Omit<ArtistFilter, 'page' | 'limit'>>({
    values: filters,
  });

  useEffect(() => {
    const subscription = filtersForm.watch((values) => {
      setFilters(values);
    });

    return () => subscription.unsubscribe();
  }, [filtersForm, filtersForm.watch, setFilters]);

  return (
    <Form {...filtersForm}>
      <form id="form-filters-artist-mnt" className="mb-5">
        <div className="grid grid-cols-4 gap-4">
          <InputText<ArtistFilter>
            name="search"
            className="col-span-1"
            debounceDelay={500}
            isDebounce
            inputProps={{
              placeholder: t('filters.search'),
            }}
          />
        </div>
      </form>
    </Form>
  );
}
