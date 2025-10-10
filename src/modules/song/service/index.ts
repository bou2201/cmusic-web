import api from '@/lib/api';
import { ApiReturnList, PaginationReq } from '~types/common';
import { Song, SongFilter, SongLyricsResponse, UseSongCouMntSchemaType } from '../types';
import { objectToQueryString } from '@/utiils/function';

const API_TAG_BASE = '/song';

export const songService = {
  getListSong: (params: SongFilter) => {
    const queryParams = objectToQueryString(params);
    return api.get<ApiReturnList<Song>>(`${API_TAG_BASE}?${queryParams}`);
  },

  getSongById: (id: string) => api.get<Song>(`${API_TAG_BASE}/${id}`),

  getLyricsById: (id: string) => api.get<SongLyricsResponse>(`${API_TAG_BASE}/${id}/lyrics`),

  createSong: (payload: UseSongCouMntSchemaType) => api.post<Song>(`${API_TAG_BASE}`, payload),

  updateSong: (id: string, payload: UseSongCouMntSchemaType) =>
    api.patch<Song>(`${API_TAG_BASE}/${id}`, payload),

  deleteSong: (id: string) => api.delete<Song>(`${API_TAG_BASE}/${id}`),

  increasePlaySong: (id: string) => api.post<Song>(`${API_TAG_BASE}/${id}/play`, {}),

  toggleTrending: (id: string) => api.patch<Song>(`${API_TAG_BASE}/${id}/trending`, {}),

  togglePublic: (id: string) => api.patch<Song>(`${API_TAG_BASE}/${id}/public`, {}),

  toggleLike: (id: string) => api.post<Song>(`${API_TAG_BASE}/${id}/like`, {}),

  getSongsLiked: (params: PaginationReq) =>
    api.get<ApiReturnList<Song>>(
      `${API_TAG_BASE}/user/liked?page=${params.page}&limit=${params.limit}`,
    ),
};
