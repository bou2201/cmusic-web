import { getCookie, removeCookie, setCookie } from '@/lib/cookie';
import { User } from '@/modules/user';
import { create } from 'zustand';

type AuthState = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
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
};

export const useAuthStore = create<AuthState & AuthAction>((set) => ({
  ...initialValues,
  setAuth: (user, accessToken, refreshToken) => {
    // Lưu vào cookie
    setCookie('accessToken', accessToken, { days: 7, secure: true, sameSite: 'strict' });
    setCookie('refreshToken', refreshToken, { days: 7, secure: true, sameSite: 'strict' });
    setCookie('user', JSON.stringify(user), { days: 7, secure: true, sameSite: 'strict' });

    set({ accessToken, refreshToken, user, isAuthenticated: true });
  },
  clearAuth: () => {
    // Xóa cookie
    removeCookie('accessToken');
    removeCookie('refreshToken');
    removeCookie('user');

    set(initialValues);
  },
  loadFromCookies: () => {
    const accessToken = getCookie('accessToken');
    const refreshToken = getCookie('refreshToken');
    const user = getCookie('user');

    if (accessToken && refreshToken && user) {
      try {
        const userParsed: User = JSON.parse(user);
        set({ user: userParsed, accessToken, refreshToken, isAuthenticated: true });
      } catch (e) {
        console.error('Failed to parse user data from cookie', e);
        set({
          user: null,
          accessToken,
          refreshToken,
          isAuthenticated: !!accessToken,
        });
      }
    } else {
      set(initialValues);
    }
  },
}));
