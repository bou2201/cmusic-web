import api from '@/lib/api';
import { ApiReturnList } from '~types/common';
import { objectToQueryString } from '@/utiils/function';
import { Artist, ArtistFilter } from '../types';

const API_TAG_BASE = '/artist';

export const artistService = {
  getListArtist: (params: ArtistFilter) => {
    const queryParams = objectToQueryString(params);
    return api.get<ApiReturnList<Artist>>(`${API_TAG_BASE}?${queryParams}`);
  },

  getArtistById: (id: string) => api.get<Artist>(`${API_TAG_BASE}/${id}`),

  createArtist: (payload: any) => api.post<Artist>(`${API_TAG_BASE}`, payload),
};
