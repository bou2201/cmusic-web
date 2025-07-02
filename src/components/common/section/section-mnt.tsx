'use client';

import { Button } from '@/components/ui';
import { PlusIcon } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { MouseEventHandler } from 'react';
import { NextIntl } from '~types/next-intl';

type SectionMntProps = {
  title: string;
  children: React.ReactNode;
  addBtn?: boolean;
  onClick?: MouseEventHandler<HTMLButtonElement>;
};

export function SectionMnt({ title, children, addBtn, onClick }: SectionMntProps) {
  const t = useTranslations<NextIntl.Namespace<'SongsPage.songMnt.action'>>(
    'SongsPage.songMnt.action',
  );

  return (
    <section className="h-full bg-sidebar rounded-md p-4 overflow-x-hidden overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-semibold text-2xl">{title}</h2>
        {addBtn ? (
          <Button variant="primary" className="font-bold" onClick={onClick}>
            <PlusIcon />
            {t('create')}
          </Button>
        ) : null}
      </div>

      {children}
    </section>
  );
}
