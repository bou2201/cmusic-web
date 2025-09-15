import api from '@/lib/api';
import { ApiReturnList } from '~types/common';
import { objectToQueryString } from '@/utiils/function';
import { Artist, ArtistFilter, UseArtistCouMntSchemaType } from '../types';

const API_TAG_BASE = '/artist';

export const artistService = {
  getListArtist: (params: ArtistFilter) => {
    const queryParams = objectToQueryString(params);
    return api.get<ApiReturnList<Artist>>(`${API_TAG_BASE}?${queryParams}`);
  },

  getArtistById: (id: string) => api.get<Artist>(`${API_TAG_BASE}/${id}`),

  createArtist: (payload: UseArtistCouMntSchemaType) =>
    api.post<Artist>(`${API_TAG_BASE}`, payload),

  updateArtist: (id: string, payload: Partial<UseArtistCouMntSchemaType>) =>
    api.patch<Artist>(`${API_TAG_BASE}/${id}`, payload),

  deleteArtist: (id: string) => api.delete<Artist>(`${API_TAG_BASE}/${id}`),

  togglePopular: (id: string) => api.patch<Artist>(`${API_TAG_BASE}/${id}/toggle-popular`, {}),

  followOrUnfollow: (id: string) => api.post<Artist>(`${API_TAG_BASE}/${id}/follow`, {}),

  getArtistsFollowed: () => api.get<Artist[]>(`${API_TAG_BASE}/followed/me`),
};
