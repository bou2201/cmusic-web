'use client';

import { SectionMnt } from '@/components/common';
import { Form } from '@/components/ui';
import { useTranslations } from 'next-intl';
import { useForm } from 'react-hook-form';
import { NextIntl } from '~types/next-intl';

export function FormCouMnt({ id }: { id?: string }) {
  const t = useTranslations<NextIntl.Namespace<'SongsPage.songMnt.createOrUpdate'>>(
    'SongsPage.songMnt.createOrUpdate',
  );

  const form = useForm({});

  return (
    <SectionMnt title={id ? t('update') : t('add')}>
      <Form {...form}>
        <form id={id ? `form-cou-mnt-update-${id}` : 'form-cou-mnt-create'}></form>
      </Form>
    </SectionMnt>
  );
}
