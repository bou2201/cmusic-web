import type { Dispatch, SetStateAction } from 'react';

declare type DialogState = {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
};
