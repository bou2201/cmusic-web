import { create } from 'zustand';
import { Song } from '../types';

type SongState = {
  track: Song | null;
};

type SongAction = {
  setTrack: (track: Song) => void;
  clearTrack: () => void;
};

const initialValues: SongState = {
  track: null,
};

export const useSongStore = create<SongState & SongAction>((set) => ({
  ...initialValues,
  setTrack: (track: Song) => set({ track }),
  clearTrack: () => set(initialValues),
}));
