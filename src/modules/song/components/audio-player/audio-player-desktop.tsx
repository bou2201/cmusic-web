'use client';

import { AudioMeta } from './audio-meta';
import { AudioSliderDuration } from './audio-slider-duration';
import { BtnIsShuffle } from './btn-is-shuffle';
import { BtnLyric } from './btn-lyric';
import { BtnPlayOrPause } from './btn-play-or-pause';
import { BtnRepeat } from './btn-repeat';
import { BtnVolume } from './btn-volume';

export function AudioPlayerDesktop({
  audioRef,
  currentTime,
  duration,
}: {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  currentTime: number;
  duration: number;
}) {
  return (
    <div className="h-16 w-full grid grid-cols-3 gap-5">
      <AudioMeta />

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-center gap-3">
          <BtnIsShuffle />

          <BtnPlayOrPause audioRef={audioRef} />

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
      </div>
    </div>
  );
}
