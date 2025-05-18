'use client';

import { DispTooltip } from '@/components/common';
import { Button } from '@/components/ui';
import { useSongStore } from '../../store';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { Repeat, Repeat1 } from 'lucide-react';

export function BtnRepeat({ audioRef }: { audioRef: React.RefObject<HTMLAudioElement | null> }) {
  const repeatMode = useSongStore((state) => state.repeatMode);
  const setRepeatMode = useSongStore((state) => state.setRepeatMode);

  const t = useTranslations<NextIntl.Namespace<'SongsPage.audioPlayer'>>('SongsPage.audioPlayer');

  const toggleRepeat = () => {
    // Cycle through repeat modes: off -> all -> one -> off
    if (repeatMode === 'off') {
      setRepeatMode('all');
    } else if (repeatMode === 'all') {
      setRepeatMode('one');
    } else {
      setRepeatMode('off');
    }

    // Set the audio loop attribute for 'one' mode
    if (audioRef.current) {
      audioRef.current.loop = repeatMode === 'one';
    }
  };

  const renderContent = () => {
    let tooltipContent = '';
    if (repeatMode === 'off') {
      tooltipContent = t('turnOnRepeat');
    } else if (repeatMode === 'all') {
      tooltipContent = t('turnOnRepeatOne');
    } else {
      tooltipContent = t('turnOffRepeat');
    }

    return tooltipContent;
  };

  return (
    <DispTooltip content={renderContent()}>
      <Button
        onClick={toggleRepeat}
        size="icon"
        className={`rounded-full ${repeatMode !== 'off' ? 'text-primary-pink hover:text-primary-pink/70' : 'hover:text-primary/70'}`}
        variant="ghost"
      >
        {repeatMode === 'one' ? (
          <Repeat1 className="!h-[18px] !w-[18px]" />
        ) : (
          <Repeat className="!h-[18px] !w-[18px]" />
        )}
      </Button>
    </DispTooltip>
  );
}
