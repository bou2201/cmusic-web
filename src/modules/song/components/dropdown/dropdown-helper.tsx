'use client';

import { DispDropdown, DispDropdownMenuProps } from '@/components/common';
import { Song } from '../../types';
import {
  CirclePlusIcon,
  CopyIcon,
  // DownloadCloudIcon,
  EllipsisIcon,
  ListPlusIcon,
  SquareChevronRightIcon,
  UserSearchIcon,
} from 'lucide-react';
import { Button } from '@/components/ui';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { copyToClipboard } from '@/utiils/function';
import { Routes } from '@/constants/routes';
import { useParams } from 'next/navigation';
import { toast } from 'sonner';
import { useSongStore } from '../../store';
import { useRouter } from '@/i18n/navigation';
import { useMemo, useState } from 'react';
import { FormAddToPlaylist } from '@/modules/playlist';
import { useAuthStore } from '@/modules/auth';
// import { downloadTrack } from '@/modules/download';

export function DropdownHelper({ song }: { song: Song }) {
  const [openPlaylist, setOpenPlaylist] = useState<boolean>(false);

  const t = useTranslations<NextIntl.Namespace<'Component.dropdown'>>('Component.dropdown');
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();

  const { user } = useAuthStore((state) => state);
  const { addToPlaylist, playNext, track } = useSongStore((state) => state);

  const menu = useMemo<DispDropdownMenuProps[]>(() => {
    const items: (DispDropdownMenuProps | null)[] = [
      {
        shortcut: <ListPlusIcon />,
        key: 'action-add-to-playlist',
        label: t('addToPlaylist'),
        onClick: (e) => {
          e.stopPropagation();
          addToPlaylist(song);
        },
      },
      {
        shortcut: <SquareChevronRightIcon />,
        key: 'action-play-next',
        label: t('playOnNext'),
        onClick: (e) => {
          e.stopPropagation();
          playNext(song);
        },
        disabled: track?.id === song.id,
      },
      user
        ? {
            shortcut: <CirclePlusIcon />,
            key: 'action-add-to-user-playlist',
            label: t('addToUserPlaylist'),
            onClick: (e) => {
              e.stopPropagation();
              setOpenPlaylist(true);
            },
          }
        : null,
      {
        shortcut: <CopyIcon />,
        key: 'action-copy',
        label: t('copyLink'),
        onClick: async (e) => {
          e.stopPropagation();
          const res = await copyToClipboard(
            `${window.location.origin}/${locale}${Routes.Songs}/${song.id}`,
          );
          if (res) toast(t('copyLinkSuccess'));
        },
      },
      {
        shortcut: <UserSearchIcon />,
        key: 'action-search-artist',
        label: t('goToArtist'),
        sub: [song.artist, ...(song?.artists ?? [])].map((art) => ({
          key: `action-go-artist-${art.id}`,
          label: art.name,
          onClick: (e) => {
            e.stopPropagation();
            router.push(`${Routes.Artists}/${art.id}`);
          },
        })),
      },
    ];

    return items.filter((item): item is DispDropdownMenuProps => item !== null);
  }, [addToPlaylist, locale, playNext, router, song, t, track?.id, user]);

  return (
    <>
      <DispDropdown menu={menu} modal={false} className="w-3xs">
        <div className="flex justify-center text-center">
          <Button
            size="icon"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <EllipsisIcon />
          </Button>
        </div>
      </DispDropdown>

      {openPlaylist ? (
        <FormAddToPlaylist songId={song.id} open={openPlaylist} setOpen={setOpenPlaylist} />
      ) : null}
    </>
  );
}
