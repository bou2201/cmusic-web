'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import { Play, Pause } from 'lucide-react';
import Image from 'next/image';
import { Button, Slider } from '@/components/ui';

type Track = {
  title: string;
  artist: string;
  src: string; // .m3u8 URL
  cover: string;
};

export function AudioPlayer({ track }: { track: Track | null }) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !track) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(track.src);
      hls.attachMedia(audio);
      hlsRef.current = hls;
    } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
      audio.src = track.src;
    } else {
      console.error('HLS not supported in this browser');
    }

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      hlsRef.current?.destroy();
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
    };
  }, [track]);

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

  const handleSliderChange = (value: number[]) => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.currentTime = value[0];
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  if (!track) {
    return (
      <div className="w-full mx-auto bg-zinc-900 text-white rounded-2xl p-4 shadow-lg text-center">
        <p className="text-zinc-400">🎵 No track selected</p>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto bg-zinc-900 text-white rounded-2xl p-4 shadow-lg flex flex-col gap-4">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-md">
          <Image
            src={track.cover}
            alt="cover"
            className="w-full h-full object-cover"
            width={120}
            height={120}
          />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{track.title}</h3>
          <p className="text-sm text-zinc-400">{track.artist}</p>
        </div>
      </div>

      <Slider
        value={[currentTime]}
        max={duration || 0}
        step={1}
        onValueChange={handleSliderChange}
      />
      <div className="flex justify-between text-xs text-zinc-400">
        <span>{formatTime(currentTime)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      <div className="flex justify-center items-center gap-4">
        <Button
          onClick={togglePlay}
          size="icon"
          className="rounded-full bg-white text-black hover:bg-white"
        >
          {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
        </Button>
      </div>

      <audio ref={audioRef} preload="metadata" />
    </div>
  );
}
