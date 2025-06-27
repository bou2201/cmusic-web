'use client';

import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Routes } from '@/constants/routes';
import {
  AlbumIcon,
  Clock9Icon,
  ComponentIcon,
  HeartIcon,
  LayoutDashboard,
  ListMusicIcon,
  PanelLeftDashed,
  UserIcon,
} from 'lucide-react';
import { NextIntl } from '~types/next-intl';
import { useAuthStore } from '@/modules/auth';
import { Role } from '@/modules/user';

type NavigationType = {
  groupTitle: string;
  groupItems: { key: string; title: string; url: string; icon?: ReactNode }[];
};

export function NavigationWeb(): NavigationType[] {
  const user = useAuthStore((state) => state.user);
  const t = useTranslations<NextIntl.Namespace<'Navigation'>>('Navigation');

  const userItems: NavigationType[] = [
    {
      groupTitle: t('library.title'),
      groupItems: [
        {
          key: 'discover',
          title: t('library.items.discover'),
          url: Routes.Discover,
          icon: <ComponentIcon />,
        },
        {
          key: 'songs',
          title: t('library.items.songs'),
          url: Routes.Songs,
          icon: <ListMusicIcon />,
        },
        {
          key: 'albums',
          title: t('library.items.albums'),
          url: Routes.Albums,
          icon: <AlbumIcon />,
        },
        {
          key: 'artists',
          title: t('library.items.artists'),
          url: Routes.Artists,
          icon: <UserIcon />,
        },
        {
          key: 'genres',
          title: t('library.items.genres'),
          url: Routes.Genres,
          icon: <PanelLeftDashed />,
        },
      ],
    },
    {
      groupTitle: t('playlist.title'),
      groupItems: [
        {
          key: 'recently-played',
          title: t('playlist.items.recently-played'),
          url: Routes.RecentlyPlayed,
          icon: <Clock9Icon />,
        },
        {
          key: 'favorite',
          title: t('playlist.items.favorite'),
          url: Routes.FavoriteSongs,
          icon: <HeartIcon />,
        },
      ],
    },
  ];

  const adminItems: NavigationType[] = [
    {
      groupTitle: t('admin.title'),
      groupItems: [
        {
          key: 'admin',
          title: t('admin.items.adminPage'),
          url: Routes.Admin,
          icon: <LayoutDashboard />,
        },
      ],
    },
  ];

  if (user && user?.role === Role.Admin) {
    return [...userItems, ...adminItems];
  }

  return userItems;
}

export function NavigationAdmin(): NavigationType[] {
  return [];
}
