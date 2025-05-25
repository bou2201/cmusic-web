'use client';

import { Box } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';

type DispEmptyProps = {
  title?: string;
};

export function DispEmpty({ title }: DispEmptyProps) {
  const t = useTranslations<NextIntl.Namespace<'Header.search'>>('Header.search');

  return (
    <div className="flex flex-col justify-center items-center w-full gap-5 py-10">
      <div className="bg-secondary p-4 rounded-md">
        <Box className="!w-8 !h-8" />
      </div>
      <span className="text-sm font-semibold opacity-80">{title ?? t('empty')}</span>
    </div>
  );
}
