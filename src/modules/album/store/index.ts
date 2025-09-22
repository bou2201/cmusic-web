import { create } from 'zustand';
import { AlbumFilter } from '../types';

type AlbumState = {
  filters: Omit<AlbumFilter, 'page' | 'limit'>;
};

type AlbumAction = {
  setFilters: (filters: Omit<AlbumFilter, 'page' | 'limit'>) => void;
};

const initialValues: AlbumState = {
  filters: {
    artistId: undefined,
    isFeatured: undefined,
    isPublic: undefined,
  },
};

export const useAlbumStore = create<AlbumState & AlbumAction>((set) => ({
  ...initialValues,
  setFilters: (filters: Omit<AlbumFilter, 'page' | 'limit'>) => set({ filters }),
}));
