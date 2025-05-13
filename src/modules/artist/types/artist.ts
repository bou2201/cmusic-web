import { Image } from '@/modules/upload';

export type Artist = {
  id: string;
  name: string;
  bio: string;
  avatar: Image;
  userId: string | null;
  isPopular: boolean;
  createdAt: string;
};
