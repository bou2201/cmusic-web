'use client';

import { AudioMeta } from './audio-meta';
import { BtnPlayOrPause } from './btn-play-or-pause';

export function AudioPlayerMobile({
  audioRef,
}: {
  audioRef: React.RefObject<HTMLAudioElement | null>;
}) {
  return (
    <div className="h-16 w-full flex justify-between items-center gap-5">
      <AudioMeta />

      <BtnPlayOrPause audioRef={audioRef} />

      <audio ref={audioRef} preload="metadata" />
    </div>
  );
}
