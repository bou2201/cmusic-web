'use client';

import { DispDropdown } from '@/components/common';
import { Song } from '../../types';
import {
  CirclePlusIcon,
  CopyIcon,
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
import { useState } from 'react';
import { FormAddToPlaylist } from '@/modules/playlist';

export function DropdownHelper({ song }: { song: Song }) {
  const [openPlaylist, setOpenPlaylist] = useState<boolean>(false);
  const t = useTranslations<NextIntl.Namespace<'Component.dropdown'>>('Component.dropdown');
  const { addToPlaylist, playNext, track } = useSongStore((state) => state);
  const { locale } = useParams<{ locale: string }>();
  const router = useRouter();

  return (
    <>
      <DispDropdown
        menu={[
          {
            shortcut: <ListPlusIcon />,
            key: 'action-add-to-playlist',
            label: t('addToPlaylist'),
            onClick: (e) => {
              // TODO: add to playlist
              e.stopPropagation();
              addToPlaylist(song);
            },
          },
          {
            shortcut: <SquareChevronRightIcon />,
            key: 'action-play-next',
            label: t('playOnNext'),
            onClick: (e) => {
              // TODO: play next
              e.stopPropagation();
              playNext(song);
            },
            disabled: track?.id === song.id,
          },
          {
            shortcut: <CirclePlusIcon />,
            key: 'action-add-to-user-playlist',
            label: t('addToUserPlaylist'),
            onClick: (e) => {
              // TODO: add to user playlist
              e.stopPropagation();
              setOpenPlaylist(true);
            },
          },
          {
            shortcut: <CopyIcon />,
            key: 'action-copy',
            label: t('copyLink'),
            onClick: async (e) => {
              e.stopPropagation();
              const res = await copyToClipboard(
                `${window.location.origin}/${locale}${Routes.Songs}/${song.id}`,
              );
              if (res) {
                toast(t('copyLinkSuccess'));
              }
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
        ]}
        modal={false}
        className="w-3xs"
      >
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
