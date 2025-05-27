'use client';

import { DispTooltip } from '@/components/common';
import { Button } from '@/components/ui';
import { ListMusic } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';

export function BtnPlaylist() {
  const t = useTranslations<NextIntl.Namespace<'SongsPage.audioPlayer'>>('SongsPage.audioPlayer');

  return (
    <DispTooltip content={t('playlist')}>
      <Button size="icon" variant="outline">
        <ListMusic />
      </Button>
    </DispTooltip>
  );
}
