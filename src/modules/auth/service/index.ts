import api from '@/lib/api';
import {
  AuthReqChangePasswordType,
  AuthReqLoginType,
  AuthReqRegisterType,
  AuthResponse,
} from '../types';

const API_TAG_BASE = '/auth';

export const authService = {
  login: (payload: AuthReqLoginType) => api.post<AuthResponse>(`${API_TAG_BASE}/login`, payload),

  register: (payload: AuthReqRegisterType) =>
    api.post<AuthResponse>(`${API_TAG_BASE}/register`, payload),

  logout: () => api.post(`${API_TAG_BASE}/logout`, {}),

  refreshToken: (refreshToken: string) =>
    api.post<Omit<AuthResponse, 'user'>>(`${API_TAG_BASE}/refresh`, { refreshToken }),

  changePassword: (payload: AuthReqChangePasswordType) =>
    api.post(`${API_TAG_BASE}/change-password`, payload),

  forgotPassword: (email: string) => api.post(`${API_TAG_BASE}/forgot-password`, { email }),

  resetPassword: (payload: { token: string; password: string }) =>
    api.post(`${API_TAG_BASE}/reset-password`, payload),
};
