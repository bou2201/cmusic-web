import { PaginationReq } from '~types/common';
import { Role } from '../constants';

export type UserFilter = PaginationReq & {
  search?: string;
  role?: Role;
  isBlocked?: boolean;
  artistRequest?: boolean;
  startDate?: Date | string;
  endDate?: Date | string;
};
