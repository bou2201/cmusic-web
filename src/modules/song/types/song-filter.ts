import { PaginationReq } from '~types/common';

export type SongFilter = PaginationReq & {
  search?: string;
  artistId?: string;
  albumId?: string;
  genreId?: string;
  isTrending?: boolean;
  isExplicit?: boolean;
};
