import { PaginationReq } from '~types/common';

export type ArtistFilter = PaginationReq & {
  search?: string;
  isPopular?: boolean;
};
