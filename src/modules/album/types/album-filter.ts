import { PaginationReq } from '~types/common';

export type AlbumFilter = PaginationReq & {
  artistId?: string;
  isFeatured?: boolean;
  isPublic?: boolean;
};
