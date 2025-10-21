'use client';

import { useIsMobile } from '@/hooks/use-mobile';
import Hls from 'hls.js';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useSongStore } from '../../store';
import { AudioPlayerMobile } from './audio-player-mobile';
import { AudioPlayerDesktop } from './audio-player-desktop';
import { songService } from '../../service';
import { Song } from '../../types';
import { KeySongStore } from '../../constants/key-store';

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const hlsRef = useRef<Hls | null>(null);
  const playCountedRef = useRef<boolean>(false);

  const [duration, setDuration] = useState<number>(0);
  const [currentTime, setCurrentTime] = useState<number>(0);

  const {
    setAudioElement,
    track,
    setTrack,
    playlist,
    setPlaylist,
    currentTrackIndex,
    nextTrack,
    setIsLoading,
    setIsPlaying,
    volume,
    isShuffle,
    repeatMode,
    addToRecentTracks,
  } = useSongStore((state) => state);
  const isMobile = useIsMobile();

  const increasePlayCount = useCallback(() => {
    if (track && track.id && !playCountedRef.current) {
      songService
        .increasePlaySong(track.id)
        .catch((err) => console.error('Failed to increase play count:', err));
      playCountedRef.current = true;
    }
  }, [track]);

  // ✅ Save player settings and state
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(KeySongStore.Volume, volume.toString());
      localStorage.setItem(KeySongStore.Shuffle, isShuffle.toString());
      localStorage.setItem(KeySongStore.Repeat, repeatMode);
      if (track) {
        localStorage.setItem(KeySongStore.CurrentTrack, JSON.stringify(track));
        localStorage.setItem(
          KeySongStore.CurrentTrackIsLiked,
          track?.isLiked?.toString() ?? 'false',
        );
      }
      if (playlist.length > 0) {
        localStorage.setItem(KeySongStore.CurrentPlaylist, JSON.stringify(playlist));
        localStorage.setItem(KeySongStore.CurrentTrackIndex, currentTrackIndex.toString());
      }
    }
  }, [volume, isShuffle, repeatMode, track, playlist, currentTrackIndex]);

  // ✅ Restore saved track and playlist on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedTrack = localStorage.getItem(KeySongStore.CurrentTrack);
        const savedPlaylist = localStorage.getItem(KeySongStore.CurrentPlaylist);
        const savedIndex = localStorage.getItem(KeySongStore.CurrentTrackIndex);

        if (savedPlaylist) {
          const parsedPlaylist: Song[] = JSON.parse(savedPlaylist);
          const index = savedIndex ? parseInt(savedIndex, 10) : 0;
          if (parsedPlaylist.length > 0) {
            setPlaylist(parsedPlaylist, index);
          }
        }

        if (savedTrack) {
          const parsedTrack: Song = JSON.parse(savedTrack);
          setTrack(parsedTrack);
        }
      } catch (error) {
        console.error('Failed to load saved audio player state:', error);
      }
    }
  }, [setTrack, setPlaylist]);

  // Side effect to handle audio loading and playback
  useEffect(() => {
    // Load saved track on initial mount if no track is set
    // if (typeof window !== 'undefined' && !track) {
    //   const savedTrack = localStorage.getItem('audio-player-track');
    //   if (savedTrack) {
    //     try {
    //       const parsedTrack = JSON.parse(savedTrack);
    //       setTrack(parsedTrack);
    //     } catch (error) {
    //       console.error('Failed to parse saved track:', error);
    //       localStorage.removeItem('audio-player-track');
    //     }
    //   }
    // }

    const audio = audioRef.current;
    if (!audio || !track) return;

    setAudioElement(audio);

    audio.volume = volume;
    audio.loop = repeatMode === 'one';
    playCountedRef.current = false;

    addToRecentTracks(track);

    setIsLoading(true);

    if (Hls.isSupported()) {
      const hls = new Hls();
      hls.loadSource(track.audioUrl);
      hls.attachMedia(audio);
      hlsRef.current = hls;

      // Add event listeners for HLS loading states
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
      });

      hls.on(Hls.Events.ERROR, (event, data) => {
        console.error('HLS error:', data);
        if (data.fatal) {
          setIsLoading(false);
        }
      });
    } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
      audio.src = track.audioUrl;
    } else {
      console.error('HLS not supported in this browser');
      setIsLoading(false);
    }

    // if (Hls.isSupported()) {
    //   const hls = new Hls();
    //   hls.loadSource(track.audioUrl);
    //   hls.attachMedia(audio);
    //   hlsRef.current = hls;
    // } else if (audio.canPlayType('application/vnd.apple.mpegurl')) {
    //   audio.src = track.audioUrl;
    // } else {
    //   console.error('HLS not supported in this browser');
    // }

    const handlePlay = () => {
      setIsPlaying(true);
      increasePlayCount();
    };
    const handlePause = () => setIsPlaying(false);
    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

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
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);

      hlsRef.current?.destroy();
      setAudioElement(null);

      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      setIsLoading(false);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [addToRecentTracks, setIsLoading, setIsPlaying, setTrack, setAudioElement, track]);

  // Side effect to handle audio playback end
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (repeatMode === 'one') {
        audio.currentTime = 0;
        playCountedRef.current = false;
        audio
          .play()
          .then(() => {
            setIsPlaying(true);
            increasePlayCount();
          })
          .catch((err) => console.error('Repeat one failed:', err));
        return;
      }

      if (playlist && playlist.length > 0) {
        if (isShuffle) {
          // Play a random track from the playlist
          const randomIndex = Math.floor(Math.random() * playlist.length);
          // Avoid playing the same track again
          const nextIndex =
            randomIndex === currentTrackIndex ? (randomIndex + 1) % playlist.length : randomIndex;

          nextTrack(nextIndex);
          return;
        }

        // Check if we're not at the end of the playlist or repeat all is on
        if (currentTrackIndex < playlist.length - 1 || repeatMode === 'all') {
          nextTrack();
          return;
        }
      }

      // No repeat
      setIsPlaying(false);
      setCurrentTime(0);
    };

    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('ended', handleEnded);
    };
  }, [
    repeatMode,
    isShuffle,
    setIsPlaying,
    playlist,
    increasePlayCount,
    currentTrackIndex,
    nextTrack,
  ]);

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

  if (!track) return null;

  return isMobile ? (
    <AudioPlayerMobile audioRef={audioRef} />
  ) : (
    <AudioPlayerDesktop audioRef={audioRef} currentTime={currentTime} duration={duration} />
  );
}
