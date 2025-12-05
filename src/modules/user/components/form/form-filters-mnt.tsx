'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { NextIntl } from '~types/next-intl';
import { useUserStore } from '../../store';
import { useForm } from 'react-hook-form';
import { UserFilter } from '../../types';
import { Combobox, DispPopover, InputCheckbox, InputText } from '@/components/common';
import { Button, Form } from '@/components/ui';
import { FilterIcon } from 'lucide-react';

type FormFiltersMntProps = {
  setPage: (page: number) => void;
};

export function FormFiltersMnt({ setPage }: FormFiltersMntProps) {
  const [openMoreFilter, setOpenMoreFilter] = useState<boolean>(false);

  const t = useTranslations<NextIntl.Namespace<'UserPage.userMnt'>>('UserPage.userMnt');
  const filters = useUserStore((state) => state.filters);
  const setFilters = useUserStore((state) => state.setFilters);

  const filtersForm = useForm<Omit<UserFilter, 'page' | 'limit'>>({
    values: filters,
  });

  useEffect(() => {
    const subscription = filtersForm.watch((values, { name }) => {
      if (name === 'isBlocked') {
        setFilters(values);
        setPage(1);
      } else {
        setFilters(values);
      }
    });

    return () => subscription.unsubscribe();
  }, [filtersForm, filtersForm.watch, setFilters, setPage]);

  return (
    <Form {...filtersForm}>
      <form id="form-filters-user-mnt" className="mb-5">
        <div className="grid grid-cols-4 gap-4">
          <InputText<UserFilter>
            name="search"
            className="col-span-1"
            debounceDelay={500}
            isDebounce
            inputProps={{
              placeholder: t('filters.search'),
            }}
          />

          <Combobox<UserFilter>
            name="role"
            className="col-span-1"
            options={[
              {
                value: '',
                label: t('filters.all'),
              },
              { label: 'Admin', value: 'ADMIN' },
              { label: 'User', value: 'USER' },
              { label: 'Artist', value: 'ARTIST' },
            ]}
            placeholder={t('filters.role')}
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
              <InputCheckbox<UserFilter> name="isBlocked" label={t('filters.isBlocked')} />
            </div>
          </DispPopover>
        </div>
      </form>
    </Form>
  );
}
