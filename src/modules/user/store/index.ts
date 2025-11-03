import { create } from 'zustand';
import { UserFilter } from '../types';

type UserState = {
  filters: Omit<UserFilter, 'page' | 'limit'>;
};

type UserAction = {
  setFilters: (filters: Omit<UserFilter, 'page' | 'limit'>) => void;
};

const initialValues: UserState = {
  filters: {
    search: undefined,
    role: undefined,
    isBlocked: undefined,
    artistRequest: undefined,
    startDate: undefined,
    endDate: undefined,
  },
};

export const useUserStore = create<UserState & UserAction>((set) => ({
  ...initialValues,
  setFilters: (filters: Omit<UserFilter, 'page' | 'limit'>) => set({ filters }),
}));
