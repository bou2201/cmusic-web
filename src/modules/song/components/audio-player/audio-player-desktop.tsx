'use client';

import { useTranslations } from 'next-intl';
import { AudioMeta } from './audio-meta';
import { AudioSliderDuration } from './audio-slider-duration';
import { BtnIsShuffle } from './btn-is-shuffle';
import { BtnLyric } from './btn-lyric';
import { BtnPlayOrPause } from './btn-play-or-pause';
import { BtnRepeat } from './btn-repeat';
import { BtnVolume } from './btn-volume';
import { NextIntl } from '~types/next-intl';
import { DispTooltip } from '@/components/common';
import { Button, Separator } from '@/components/ui';
import { SkipBack, SkipForward } from 'lucide-react';
import { useSongStore } from '../../store';
import { BtnPlaylist } from './btn-playlist';

export function AudioPlayerDesktop({
  audioRef,
  currentTime,
  duration,
}: {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  currentTime: number;
  duration: number;
}) {
  const { playlist, previousTrack, nextTrack, currentTrackIndex } = useSongStore((state) => state);
  const t = useTranslations<NextIntl.Namespace<'SongsPage.audioPlayer'>>('SongsPage.audioPlayer');

  return (
    <div className="h-16 w-full grid grid-cols-3 gap-5">
      <AudioMeta />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-center gap-3">
          <BtnIsShuffle />

          <DispTooltip content={t('previous')}>
            <Button
              size="icon"
              className="rounded-full"
              variant="ghost"
              disabled={playlist.length <= 0 || currentTrackIndex < 1}
              onClick={() => {
                previousTrack();
              }}
            >
              <SkipBack className="fill-primary" />
            </Button>
          </DispTooltip>

          <BtnPlayOrPause audioRef={audioRef} />

          <DispTooltip content={t('next')}>
            <Button
              size="icon"
              className="rounded-full"
              variant="ghost"
              disabled={playlist.length <= 0 || currentTrackIndex >= playlist.length - 1}
              onClick={() => {
                nextTrack();
              }}
            >
              <SkipForward className="fill-primary" />
            </Button>
          </DispTooltip>

          <BtnRepeat audioRef={audioRef} />
        </div>
        <div>
          <AudioSliderDuration audioRef={audioRef} currentTime={currentTime} duration={duration} />

          <audio ref={audioRef} preload="metadata" />
        </div>
      </div>

      <div className="flex items-center justify-end gap-1">
        <BtnLyric />
        <BtnVolume audioRef={audioRef} />

        <Separator orientation="vertical" className="mx-3 data-[orientation=vertical]:h-6" />

        <BtnPlaylist />
      </div>
    </div>
  );
}
