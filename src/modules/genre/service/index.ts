import api from '@/lib/api';
import { Genre, GenreFilter, UseGenreCouMntSchemaType } from '../types';
import { objectToQueryString } from '@/utiils/function';
import { ApiReturnList } from '~types/common';

const API_TAG_BASE = '/genre';

export const genreService = {
  getListGenre: (params: GenreFilter) => {
    const queryParams = objectToQueryString(params);
    return api.get<ApiReturnList<Genre>>(`${API_TAG_BASE}?${queryParams}`);
  },

  getGenreById: (id: string) => api.get<Genre>(`${API_TAG_BASE}/${id}`),

  getGenreBySlug: (slug: string) => api.get<Genre>(`${API_TAG_BASE}/slug/${slug}`),

  createGenre: (payload: UseGenreCouMntSchemaType) => api.post<Genre>(`${API_TAG_BASE}`, payload),

  updateGenre: (id: string, payload: Partial<UseGenreCouMntSchemaType>) =>
    api.patch<Genre>(`${API_TAG_BASE}/${id}`, payload),

  deleteGenre: (id: string) => api.delete<Genre>(`${API_TAG_BASE}/${id}`),

  toggleGenreFeatured: (id: string) =>
    api.patch<Genre>(`${API_TAG_BASE}/${id}/toggle-featured`, {}),
};
