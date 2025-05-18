'use client';

import { DispTooltip } from '@/components/common';
import { Button } from '@/components/ui';
import { MicVocal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';

export function BtnLyric() {
  const t = useTranslations<NextIntl.Namespace<'SongsPage.audioPlayer'>>('SongsPage.audioPlayer');

  return (
    <DispTooltip content={t('turnOnLyrics')}>
      <Button size="icon" variant="ghost" className="rounded-full">
        <MicVocal />
      </Button>
    </DispTooltip>
  );
}
