import { create } from 'zustand';
import { Song } from '../types';
import {
  addTrackToRecent,
  getInitialRecentTracks,
  getInitialRepeatMode,
  getInitialShuffle,
  getInitialVolume,
} from '../utils/function';

type SongState = {
  track: Song | null;
  isLoading: boolean;
  recentTracks: Song[];
  isPlaying: boolean;
  volume: number;
  isShuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
};

type SongAction = {
  setTrack: (track: Song) => void;
  clearTrack: () => void;
  addToRecentTracks: (track: Song) => void;
  clearRecentTracks: () => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setIsShuffle: (isShuffle: boolean) => void;
  setRepeatMode: (repeatMode: 'off' | 'all' | 'one') => void;
};

const initialValues: SongState = {
  track: null,
  isLoading: false,
  recentTracks: getInitialRecentTracks(),
  isPlaying: false,
  volume: getInitialVolume(),
  isShuffle: getInitialShuffle(),
  repeatMode: getInitialRepeatMode(),
};

export const useSongStore = create<SongState & SongAction>((set) => ({
  ...initialValues,
  setTrack: (track: Song) => set({ track }),
  clearTrack: () => set(initialValues),
  addToRecentTracks: (track: Song) => {
    set((state) => {
      const updatedRecentTracks = addTrackToRecent(state.recentTracks, track);
      return { recentTracks: updatedRecentTracks };
    });
  },
  clearRecentTracks: () => {
    localStorage.removeItem('recentTracks');
    set({ recentTracks: [] });
  },
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
  setVolume: (volume: number) => set({ volume }),
  setIsShuffle: (isShuffle: boolean) => set({ isShuffle }),
  setRepeatMode: (repeatMode: 'off' | 'all' | 'one') => set({ repeatMode }),
}));
