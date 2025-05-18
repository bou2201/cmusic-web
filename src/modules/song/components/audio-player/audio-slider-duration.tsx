'use client';

import { Slider } from '@/components/ui';
import { formatDuration } from '@/utiils/function';

export function AudioSliderDuration({
  audioRef,
  currentTime,
  duration,
}: {
  audioRef: React.RefObject<HTMLAudioElement | null>;
  currentTime: number;
  duration: number;
}) {
  const handleSliderChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
  };

  return (
    <div className="flex items-center justify-center text-sm gap-5">
      <span className="opacity-70 font-medium text-[13px] w-9 text-center">
        {formatDuration(currentTime)}
      </span>
      <Slider
        value={[currentTime]}
        max={duration || 0}
        step={1}
        onValueChange={handleSliderChange}
        className="w-72"
      />
      <span className="font-semibold text-[13px] w-9 text-center">{formatDuration(duration)}</span>
    </div>
  );
}
