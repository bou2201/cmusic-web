import api from '@/lib/api';
import {
  AuthReqChangePasswordType,
  AuthReqLoginType,
  AuthReqRegisterType,
  AuthReqResetPasswordType,
  AuthResponse,
} from '../types';
import { User } from '@/modules/user';

const API_TAG_BASE = '/auth';

export const authService = {
  login: (payload: AuthReqLoginType) => api.post<AuthResponse>(`${API_TAG_BASE}/login`, payload),

  register: (payload: AuthReqRegisterType) =>
    api.post<AuthResponse>(`${API_TAG_BASE}/register`, {
      name: payload.name,
      email: payload.email,
      password: payload.password,
    }),

  google: () => api.get(`${API_TAG_BASE}/google`),

  logout: () => api.post(`${API_TAG_BASE}/logout`, {}),

  refreshToken: (refreshToken: string) =>
    api.post<Omit<AuthResponse, 'user'>>(`${API_TAG_BASE}/refresh`, { refreshToken }),

  changePassword: (payload: AuthReqChangePasswordType) =>
    api.post(`${API_TAG_BASE}/change-password`, {
      currentPassword: payload.currentPassword,
      newPassword: payload.newPassword,
    }),

  forgotPassword: (email: string) => api.post(`${API_TAG_BASE}/forgot-password`, { email }),

  resetPassword: (payload: AuthReqResetPasswordType) =>
    api.post(`${API_TAG_BASE}/reset-password`, {
      token: payload.token,
      newPassword: payload.newPassword,
    }),

  me: (accessToken: string) =>
    api.get<User>(`${API_TAG_BASE}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
};
