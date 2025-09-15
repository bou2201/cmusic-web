import api from '@/lib/api';

const API_TAG_BASE = '/download';

export const downloadService = {
  downloadTrack: (url: string) => {
    return api.get(`${API_TAG_BASE}/m3u8-to-mp3?url=${url}`);
  },
};
