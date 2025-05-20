'use client';

import { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import { Routes } from '@/constants/routes';
import {
  AlbumIcon,
  Clock9Icon,
  ComponentIcon,
  HeartIcon,
  ListMusicIcon,
  PanelLeftDashed,
  UserIcon,
} from 'lucide-react';
import { NextIntl } from '~types/next-intl';

type NavigationType = {
  groupTitle: string;
  groupItems: { title: string; url: string; icon?: ReactNode }[];
};

export function Navigation(): NavigationType[] {
  const t = useTranslations<NextIntl.Namespace<'Navigation'>>('Navigation');

  return [
    {
      groupTitle: t('library.title'),
      groupItems: [
        {
          title: t('library.items.discover'),
          url: Routes.Discover,
          icon: <ComponentIcon />,
        },
        {
          title: t('library.items.songs'),
          url: Routes.Songs,
          icon: <ListMusicIcon />,
        },
        {
          title: t('library.items.albums'),
          url: Routes.Albums,
          icon: <AlbumIcon />,
        },
        {
          title: t('library.items.artists'),
          url: Routes.Artists,
          icon: <UserIcon />,
        },
        {
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
          title: t('playlist.items.recently-played'),
          url: Routes.RecentlyPlayed,
          icon: <Clock9Icon />,
        },
        {
          title: t('playlist.items.favorite'),
          url: Routes.FavoriteSongs,
          icon: <HeartIcon />,
        },
      ],
    },
  ];
}
