import { Artist } from '@/modules/artist';
import { Genre } from '@/modules/genre';
import { Image } from '@/modules/upload';

export type Song = {
  id: string;
  title: string;
  cover: Image | null;
  duration: number;
  audioUrl: string;
  audioPublicId: string;
  artistId: string;
  albumId: string | null;
  playCount: number;
  isTrending: boolean;
  createdAt: string;
  updatedAt: string;
  isPublic: boolean;
  lyrics: string;
  isExplicit: boolean;
  artist: Artist;
  artists: Artist[];
  album: any;
  genres: Genre[];
  _count: {
    likedBy: number;
  };
};
