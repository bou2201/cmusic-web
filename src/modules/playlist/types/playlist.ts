import { Song } from '@/modules/song';

export type Playlist = {
  id: string;
  title: string;
  cover?: string;
  userId: string;
  createdAt: Date | string;
  songs: Song[];
  songAddedIds?: string[];
  _cound: {
    songs: number;
  };
};
