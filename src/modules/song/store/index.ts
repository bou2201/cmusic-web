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
  playlist: Song[];
  currentTrackIndex: number;
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
  setPlaylist: (playlist: Song[], startIndex?: number) => void;
  nextTrack: (specificIndex?: number) => void;
  previousTrack: () => void;
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
  playlist: [],
  currentTrackIndex: 0,
  isLoading: false,
  recentTracks: getInitialRecentTracks(),
  isPlaying: false,
  volume: getInitialVolume(),
  isShuffle: getInitialShuffle(),
  repeatMode: getInitialRepeatMode(),
};

export const useSongStore = create<SongState & SongAction>((set, get) => ({
  ...initialValues,
  setTrack: (track: Song) => set({ track }),
  clearTrack: () => set(initialValues),
  setPlaylist: (playlist: Song[], startIndex = 0) => {
    if (playlist.length === 0) return;

    const validIndex = Math.min(startIndex, playlist.length - 1);
    set({
      playlist,
      currentTrackIndex: validIndex,
      track: playlist[validIndex],
    });
  },
  nextTrack: (specificIndex?: number) => {
    const { playlist, currentTrackIndex, repeatMode } = get();

    if (!playlist || playlist.length === 0) return;

    let nextIndex;
    if (specificIndex !== undefined) {
      nextIndex = specificIndex;
    } else {
      nextIndex = currentTrackIndex + 1;
      // If we're at the end and repeat all is on, go back to the beginning
      if (nextIndex >= playlist.length) {
        if (repeatMode === 'all') {
          nextIndex = 0;
        } else {
          return; // End of playlist with no repeat
        }
      }
    }

    set({
      currentTrackIndex: nextIndex,
      track: playlist[nextIndex],
    });
  },
  previousTrack: () => {
    const { playlist, currentTrackIndex } = get();

    if (!playlist || playlist.length === 0) return;

    let prevIndex = currentTrackIndex - 1;
    // If we're at the beginning, go to the end
    if (prevIndex < 0) {
      prevIndex = playlist.length - 1;
    }

    set({
      currentTrackIndex: prevIndex,
      track: playlist[prevIndex],
    });
  },
  addToRecentTracks: (track: Song) => {
    set((state) => {
      const updatedRecentTracks = addTrackToRecent(state.recentTracks, track);
      return { recentTracks: state.recentTracks };
      // return { recentTracks: updatedRecentTracks };
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
