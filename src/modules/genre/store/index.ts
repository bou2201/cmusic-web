import { create } from 'zustand';
import { GenreFilter } from '../types';

type GenreState = {
  filters: Omit<GenreFilter, 'page' | 'limit'>;
};

type GenreAction = {
  setFilters: (filters: Omit<GenreFilter, 'page' | 'limit'>) => void;
};

const initialValues: GenreState = {
  filters: {
    search: undefined,
    isFeatured: undefined,
  },
};

export const useGenreStore = create<GenreState & GenreAction>((set) => ({
  ...initialValues,
  setFilters: (filters: Omit<GenreFilter, 'page' | 'limit'>) => set({ filters }),
}));
