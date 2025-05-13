import type { Dispatch, SetStateAction } from 'react';

declare type DialogState = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};

declare type ApiReturn<T> = {
  data: T | null;
  message: string;
  status: number;
};

declare type ApiReturnList<T> = {
  data: T[] | null;
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

declare type PaginationReq = {
  page: number;
  limit: number;
};
