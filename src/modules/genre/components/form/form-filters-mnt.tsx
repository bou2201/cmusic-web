'use client';

import { useForm } from 'react-hook-form';
import { Form } from '@/components/ui';
import { InputText } from '@/components/common';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { useEffect } from 'react';
import { useGenreStore } from '../../store';
import { GenreFilter } from '../../types';

export function FormFiltersMnt() {
  const t = useTranslations<NextIntl.Namespace<'GenrePage.genreMnt'>>('GenrePage.genreMnt');
  const filters = useGenreStore((state) => state.filters);
  const setFilters = useGenreStore((state) => state.setFilters);

  const filtersForm = useForm<Omit<GenreFilter, 'page' | 'limit'>>({
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
      <form id="form-filters-genre-mnt" className="mb-5">
        <div className="grid grid-cols-4 gap-4">
          <InputText<GenreFilter>
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
