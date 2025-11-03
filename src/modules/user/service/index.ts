import api from '@/lib/api';
import { ApiReturnList } from '~types/common';
import { objectToQueryString } from '@/utiils/function';
import { User, UserChangeStatus, UserFilter, UserStatusHistory } from '../types';

const API_TAG_BASE = '/user';

export const userService = {
  getListUser: (params: UserFilter) => {
    const queryParams = objectToQueryString(params);
    return api.get<ApiReturnList<User>>(`${API_TAG_BASE}?${queryParams}`);
  },

  getUserById: (id: string) => api.get<User>(`${API_TAG_BASE}/${id}`),

  getUserHistoryStatus: (id: string) =>
    api.get<UserStatusHistory[]>(`${API_TAG_BASE}/${id}/status-history`),

  changeStatus: (payload: UserChangeStatus) =>
    api.patch<User>(`${API_TAG_BASE}/change-status`, payload),
};
