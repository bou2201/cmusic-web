'use client';

import { DispTooltip } from '@/components/common';
import { useSongStore } from '../../store';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { Button } from '@/components/ui';
import { Shuffle } from 'lucide-react';

export function BtnIsShuffle() {
  const isShuffle = useSongStore((state) => state.isShuffle);
  const setIsShuffle = useSongStore((state) => state.setIsShuffle);

  const t = useTranslations<NextIntl.Namespace<'SongsPage.audioPlayer'>>('SongsPage.audioPlayer');

  return (
    <DispTooltip content={isShuffle ? t('turnOffShuffle') : t('turnOnShuffle')}>
      <Button
        onClick={() => {
          setIsShuffle(!isShuffle);
        }}
        size="icon"
        className={`rounded-full ${isShuffle ? 'text-primary-pink hover:text-primary-pink/70' : 'hover:text-primary/70'}`}
        variant="ghost"
      >
        <Shuffle className="!h-[18px] !w-[18px]" />
      </Button>
    </DispTooltip>
  );
}
