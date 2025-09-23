import { getCookie, removeCookie, setCookie } from '@/lib/cookie';
import { User } from '@/modules/user';
import { create } from 'zustand';

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  hydrated: boolean;
};

type AuthAction = {
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  clearAuth: () => void;
  loadFromCookies: () => void;
};

const initialValues: AuthState = {
  accessToken: null,
  refreshToken: null,
  user: null,
  isAuthenticated: false,
  hydrated: false,
};

export const useAuthStore = create<AuthState & AuthAction>((set) => ({
  ...initialValues,
  setAuth: (user, accessToken, refreshToken) => {
    // Lưu vào cookie
    setCookie('accessToken', accessToken, { days: 7, secure: true, sameSite: 'strict' });
    setCookie('refreshToken', refreshToken, { days: 7, secure: true, sameSite: 'strict' });
    setCookie('user', JSON.stringify(user), { days: 7, secure: true, sameSite: 'strict' });

    set({ accessToken, refreshToken, user, isAuthenticated: true, hydrated: true });
  },
  clearAuth: () => {
    // Xóa cookie
    removeCookie('accessToken');
    removeCookie('refreshToken');
    removeCookie('user');

    set({ ...initialValues, hydrated: true });
  },
  loadFromCookies: () => {
    const accessToken = getCookie('accessToken');
    const refreshToken = getCookie('refreshToken');
    const userCookie = getCookie('user');

    if (accessToken && refreshToken && userCookie) {
      try {
        const decodedUser = decodeURIComponent(userCookie);
        const userParsed: User = JSON.parse(decodedUser);
        set({ user: userParsed, accessToken, refreshToken, isAuthenticated: true, hydrated: true });
      } catch (e) {
        console.error('Failed to parse user data from cookie', e);
        set({
          user: null,
          accessToken,
          refreshToken,
          isAuthenticated: !!accessToken,
          hydrated: true,
        });
      }
    } else {
      set({ ...initialValues, hydrated: true });
    }
  },
}));
