import api from '@/lib/api';
import { Audio, Image } from '../types';

const API_TAG_BASE = '/upload';

export const songService = {
  uploadImage: (formData: FormData) => {
    return api.post<Image>(`${API_TAG_BASE}/image`, formData);
  },

  uploadAudio: (formData: FormData) => {
    return api.post<Audio>(`${API_TAG_BASE}/audio`, formData);
  },

  deleteFile: (publicId: string) => {
    return api.delete<boolean>(`${API_TAG_BASE}/delete`, { body: { publicId } as any });
  },
};
