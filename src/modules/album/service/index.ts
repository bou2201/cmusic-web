import api from '@/lib/api';
import { ApiReturnList } from '~types/common';
import { objectToQueryString } from '@/utiils/function';
import { Album, AlbumAddOrRemoveSong, AlbumFilter, UseAlbumCouMntSchemaType } from '../types';

const API_TAG_BASE = '/album';

export const albumService = {
  getListAlbum: (params: AlbumFilter) => {
    const queryParams = objectToQueryString(params);
    return api.get<ApiReturnList<Album>>(`${API_TAG_BASE}?${queryParams}`);
  },

  getAlbumById: (id: string) => api.get<Album>(`${API_TAG_BASE}/${id}`),

  createAlbum: (payload: UseAlbumCouMntSchemaType) => api.post<Album>(`${API_TAG_BASE}`, payload),

  updateAlbum: (id: string, payload: Partial<UseAlbumCouMntSchemaType>) =>
    api.patch<Album>(`${API_TAG_BASE}/${id}`, payload),

  deleteAlbum: (id: string) => api.delete<Album>(`${API_TAG_BASE}/${id}`),

  addSongToAlbum: (payload: AlbumAddOrRemoveSong) =>
    api.post<Album>(`${API_TAG_BASE}/add-to-album`, payload),

  removeSongFromAlbum: (payload: AlbumAddOrRemoveSong) =>
    api.post<Album>(`${API_TAG_BASE}/remove-from-album`, payload),
};
