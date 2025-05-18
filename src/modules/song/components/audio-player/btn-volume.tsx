'use client';

import { Button, Slider } from '@/components/ui';
import { Volume2, VolumeX } from 'lucide-react';
import { useSongStore } from '../../store';

export function BtnVolume({ audioRef }: { audioRef: React.RefObject<HTMLAudioElement | null> }) {
  const volume = useSongStore((state) => state.volume);
  const setVolume = useSongStore((state) => state.setVolume);

  const toggleVolume = () => {
    const audio = audioRef.current;
    if (!audio) return;

    // Store the previous volume level before muting
    if (volume > 0) {
      // If currently has volume, mute it
      setVolume(0);
    } else {
      // If currently muted, restore to previous volume or default to 1
      setVolume(audio.dataset.previousVolume ? parseFloat(audio.dataset.previousVolume) : 1);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    const newVolume = value[0];

    // Store the current volume for later restoration when unmuting
    if (newVolume > 0) {
      audio.dataset.previousVolume = newVolume.toString();
    }

    audio.volume = newVolume;
    setVolume(newVolume);
  };

  return (
    <div className="flex items-center gap-1">
      <Button size="icon" variant="ghost" className="rounded-full" onClick={toggleVolume}>
        {volume !== 0 ? <Volume2 /> : <VolumeX />}
      </Button>
      <Slider
        value={[volume]}
        max={1}
        min={0}
        step={0.01}
        onValueChange={handleVolumeChange}
        className="w-16"
      />
    </div>
  );
}
