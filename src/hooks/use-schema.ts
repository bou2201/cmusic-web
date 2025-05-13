'use client';

import { useTranslations } from 'next-intl';
import { z } from 'zod';
import { NextIntl } from '~types/next-intl';

export const useEmailSchema = () => {
  const t = useTranslations<NextIntl.Namespace<'Validation'>>('Validation');

  return z
    .string({ message: t('common.required') })
    .min(1, { message: t('common.required') })
    .email(t('common.email'));
};

export const usePasswordSchema = () => {
  const t = useTranslations<NextIntl.Namespace<'Validation'>>('Validation');

  return z
    .string({ message: t('common.required') })
    .min(6, { message: t('common.minLength', { 0: 6 }) });
};
