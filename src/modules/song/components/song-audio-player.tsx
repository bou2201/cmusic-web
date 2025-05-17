'use client';

import { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';
import {
  Play,
  Pause,
  Heart,
  Volume2,
  VolumeX,
  Shuffle,
  Repeat1,
  Repeat,
  MicVocal,
} from 'lucide-react';
import Image from 'next/image';
import { Button, Slider } from '@/components/ui';
import { useSongStore } from '../store';
import { formatDuration, getArtistName } from '@/utiils/function';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { DispTooltip } from '@/components/common';
import { useIsMobile } from '@/hooks/use-mobile';

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsRef = useRef<Hls | null>(null);

  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [volume, setVolume] = useState<number>(() => {
    if (typeof window !== 'undefined') {
      const savedVolume = localStorage.getItem('audio-player-volume');
      return savedVolume ? parseFloat(savedVolume) : 1;
    }
    return 1;
  });
  const [isShuffle, setIsShuffle] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('audio-player-shuffle') === 'true';
    }
    return false;
  });
  const [repeatMode, setRepeatMode] = useState<'off' | 'all' | 'one'>(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('audio-player-repeat') as 'off' | 'all' | 'one';
      return savedMode || 'off';
    }
    return 'off';
  });

  const { track, setTrack } = useSongStore((state) => state);
  const t = useTranslations<NextIntl.Namespace<'SongsPage.audioPlayer'>>('SongsPage.audioPlayer');
  const isMobile = useIsMobile();

  // Save player state to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('audio-player-volume', volume.toString());
      localStorage.setItem('audio-player-shuffle', isShuffle.toString());
      localStorage.setItem('audio-player-repeat', repeatMode);

      // Save current track if it exists
      if (track) {
        localStorage.setItem('audio-player-track', JSON.stringify(track));
      }
    }
  }, [volume, isShuffle, repeatMode, track]);

  // Side effect to handle audio loading and playback
  useEffect(() => {
    // Load saved track on initial mount if no track is set
    if (typeof window !== 'undefined' && !track) {
      const savedTrack = localStorage.getItem('audio-player-track');
      if (savedTrack) {
        try {
          const parsedTrack = JSON.parse(savedTrack);
          setTrack(parsedTrack);
        } catch (error) {
          console.error('Failed to parse saved track:', error);
          localStorage.removeItem('audio-player-track');
        }
      }
    }

    const audio = audioRef.current;
    if (!audio || !track) return;

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(track.audioUrl);
      hls.attachMedia(audio);
      hlsRef.current = hls;
    } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
      audio.src = track.audioUrl;
    } else {
      console.error('HLS not supported in this browser');
    }

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);

    // Auto-play when track changes
    audio.addEventListener('loadeddata', () => {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error('Auto-play failed:', err));
    });

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('loadeddata', () => {});

      hlsRef.current?.destroy();

      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
    };
  }, [setTrack, track]);

  // Side effect to handle audio playback end
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (repeatMode === 'one') {
        // For repeat one, the audio.loop property handles it
        return;
      } else if (repeatMode === 'all') {
        // For repeat all, restart the current track
        audio.currentTime = 0;
        audio
          .play()
          .then(() => setIsPlaying(true))
          .catch((err) => console.error('Auto-play failed:', err));
      } else {
        // Default behavior - stop playing
        setIsPlaying(false);
        setCurrentTime(0);
      }

      // Here you would add logic to play the next track if shuffle is on
      if (isShuffle) {
        // Implement shuffle logic here
        console.log('Shuffle is on, would play random track next');
      }
    };

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [repeatMode, isShuffle]);

  // Side effect to update the volume when the volume state changes
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
  }, [volume]);

  // Side effect to update the audio loop property when repeatMode changes
  useEffect(() => {
    // Update audio loop property when repeatMode changes
    if (audioRef.current) {
      audioRef.current.loop = repeatMode === 'one';
    }
  }, [repeatMode]);

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

  const toggleShuffle = () => {
    setIsShuffle((prev) => !prev);
    // Here you would implement the actual shuffle functionality
  };

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

  if (!track) return null;

  return (
    <div className="h-16 w-full grid grid-cols-3 gap-5">
      <div className="flex items-center gap-3">
        <div className="w-14 h-14 rounded-md overflow-hidden">
          <Image
            src={track.cover?.url ?? '/images/song-default-white.png'}
            alt="cover"
            className="w-full h-full object-cover"
            width={120}
            height={120}
          />
        </div>
        <div>
          <h3 className="font-semibold">{track.title}</h3>
          <p className="text-sm text-zinc-400">{getArtistName(track.artist, track.artists)}</p>
        </div>
        <Button variant="ghost" size="icon">
          <Heart />
        </Button>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-center gap-3">
          <DispTooltip content={isShuffle ? t('turnOffShuffle') : t('turnOnShuffle')}>
            <Button
              onClick={toggleShuffle}
              size="icon"
              className={`rounded-full ${isShuffle ? 'text-primary-pink hover:text-primary-pink/70' : 'hover:text-primary/70'}`}
              variant="ghost"
            >
              <Shuffle className="!h-[18px] !w-[18px]" />
            </Button>
          </DispTooltip>

          <DispTooltip content={isPlaying ? t('pause') : t('play')}>
            <Button
              onClick={togglePlay}
              size="icon"
              className="rounded-full w-10 h-10 border-primary/80 hover:border-primary-pink group"
              variant="outline"
            >
              {isPlaying ? (
                <Pause className="!w-5 !h-5 fill-primary group-hover:fill-primary-pink group-hover:stroke-primary-pink" />
              ) : (
                <Play className="!w-5 !h-5 fill-primary group-hover:fill-primary-pink group-hover:stroke-primary-pink" />
              )}
            </Button>
          </DispTooltip>

          <DispTooltip
            content={
              repeatMode === 'off'
                ? t('turnOnRepeat')
                : repeatMode === 'all'
                  ? t('turnOnRepeatOne')
                  : t('turnOffRepeat')
            }
          >
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
        </div>
        <div>
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
            <span className="font-semibold text-[13px] w-9 text-center">
              {formatDuration(duration)}
            </span>
          </div>

          <audio ref={audioRef} preload="metadata" />
        </div>
      </div>

      <div className="flex items-center justify-end gap-1">
        <DispTooltip content={t('turnOnLyrics')}>
          <Button size="icon" variant="ghost" className="rounded-full">
            <MicVocal />
          </Button>
        </DispTooltip>
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
    </div>
  );
}
