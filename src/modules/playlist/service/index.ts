import api from '@/lib/api';
import { ApiReturnList, PaginationReq } from '~types/common';
import { objectToQueryString } from '@/utiils/function';
import { Playlist } from '../types';

const API_TAG_BASE = '/playlist';

export const playlistService = {
  getListPlaylist: (params: PaginationReq) => {
    const queryParams = objectToQueryString(params);
    return api.get<ApiReturnList<Playlist>>(`${API_TAG_BASE}?${queryParams}`);
  },
};
