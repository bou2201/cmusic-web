import { User } from '@/modules/user';

export type AuthResponse = {
  accessToken: string;
  refreshToken: string;
  user: User;
};
