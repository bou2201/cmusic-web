import { PaginationReq } from '~types/common';

export type GenreFilter = PaginationReq & {
  search?: string;
  isFeatured?: boolean;
};
