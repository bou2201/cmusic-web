'use client';

import { useTranslations } from 'next-intl';
import { useSongStore } from '../../store';
import { NextIntl } from '~types/next-intl';
import { DispTooltip } from '@/components/common';
import { Button } from '@/components/ui';
import { Pause, Play } from 'lucide-react';

export function BtnPlayOrPause({
  audioRef,
}: {
  audioRef: React.RefObject<HTMLAudioElement | null>;
}) {
  const isPlaying = useSongStore((state) => state.isPlaying);
  const setIsPlaying = useSongStore((state) => state.setIsPlaying);

  const t = useTranslations<NextIntl.Namespace<'SongsPage.audioPlayer'>>('SongsPage.audioPlayer');

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }

    setIsPlaying(!isPlaying);
  };

  return (
    <DispTooltip content={isPlaying ? t('pause') : t('play')}>
      <Button
        onClick={togglePlay}
        size="icon"
        className="rounded-full bg-primary hover:bg-primary-pink group"
        variant="outline"
      >
        {isPlaying ? (
          <Pause className="fill-background stroke-background group-hover:fill-primary group-hover:stroke-primary" />
        ) : (
          <Play className="fill-background stroke-background group-hover:fill-primary group-hover:stroke-primary" />
        )}
      </Button>
    </DispTooltip>
  );
}
