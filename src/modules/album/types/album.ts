import { Image } from '@/modules/upload';

export type Album = {
  id: string;
  title: string;
  description: string;
  cover: Image | null;
  artistId: string;
  releaseDate: string;
  createdAt: string;
  updatedAt: string;
  isFeatured: boolean;
  isPublic: boolean;
};
