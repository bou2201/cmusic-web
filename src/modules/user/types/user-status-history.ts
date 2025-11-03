import { UserStatus } from '../constants';

export type UserStatusHistory = {
  id: string;
  changedBy: string;
  createdAt: Date | string;
  status: UserStatus;
  userId: string;
  description: string;
};
