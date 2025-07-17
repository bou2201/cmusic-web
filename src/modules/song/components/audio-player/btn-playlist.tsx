'use client';

import { DispTooltip } from '@/components/common';
import { Button } from '@/components/ui';
import { ListMusic } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { useSongStore } from '../../store';

export function BtnPlaylist() {
  const { openPlayList, setOpenPlayList } = useSongStore((state) => state);

  const t = useTranslations<NextIntl.Namespace<'SongsPage.audioPlayer'>>('SongsPage.audioPlayer');

  return (
    <>
      <DispTooltip content={t('playlist')}>
        <Button
          size="icon"
          variant="outline"
          onClick={() => {
            setOpenPlayList(!openPlayList);
          }}
          className={`${openPlayList ? 'bg-primary-pink hover:bg-primary-pink' : ''}`}
        >
          <ListMusic className='stroke-3' />
        </Button>
      </DispTooltip>
    </>
  );
}
