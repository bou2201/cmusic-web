import { Image } from '@/modules/upload';
import { Role } from '../constants/enum';

export type User = {
  id: string;
  email: string;
  name: string;
  password?: string;
  avatar: Image;
  artistApproved: boolean;
  artistRequest: boolean;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
  role: Role;
  resetToken: string | null;
  resetTokenExpiry: string | null;
  googleId: string | null;
  isGoogleAccount: boolean;
};
