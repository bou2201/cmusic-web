import { create } from 'zustand';
import { ArtistFilter } from '../types';

type ArtistState = {
  filters: Omit<ArtistFilter, 'page' | 'limit'>;
};

type ArtistAction = {
  setFilters: (filters: Omit<ArtistFilter, 'page' | 'limit'>) => void;
};

const initialValues: ArtistState = {
  filters: {
    search: undefined,
    isPopular: undefined,
  },
};

export const useArtistStore = create<ArtistState & ArtistAction>((set) => ({
  ...initialValues,
  setFilters: (filters: Omit<ArtistFilter, 'page' | 'limit'>) => set({ filters }),
}));
