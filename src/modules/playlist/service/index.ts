import api from '@/lib/api';
import { ApiReturnList, PaginationReq } from '~types/common';
import { objectToQueryString } from '@/utiils/function';
import { Playlist, PlaylistCreateSchema } from '../types';

const API_TAG_BASE = '/playlist';

export const playlistService = {
  getListPlaylist: (params: PaginationReq) => {
    const queryParams = objectToQueryString(params);
    return api.get<ApiReturnList<Playlist>>(`${API_TAG_BASE}?${queryParams}`);
  },

  getPlaylistById: (id: string) => api.get<Playlist>(`${API_TAG_BASE}/${id}`),

  createPlaylist: (payload: PlaylistCreateSchema) => api.post<Playlist>(`${API_TAG_BASE}`, payload),

  updatePlaylist: (id: string, payload: PlaylistCreateSchema) =>
    api.patch<Playlist>(`${API_TAG_BASE}/${id}`, payload),

  deletePlaylist: (id: string) => api.delete<Playlist>(`${API_TAG_BASE}/${id}`),

  addSongToPlaylist: (playlistId: string, songId: string) =>
    api.post<Playlist>(`${API_TAG_BASE}/${playlistId}/add/${songId}`, {}),

  removeSongFromPlaylist: (playlistId: string, songId: string) =>
    api.post<Playlist>(`${API_TAG_BASE}/${playlistId}/remove/${songId}`, {}),
};
