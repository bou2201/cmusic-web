'use client';

import { JSX, useEffect, useState } from 'react';
import { Playlist } from '../../types';
import Image from 'next/image';
import { Button } from '@/components/ui';
import { Loader2Icon, PlayIcon } from 'lucide-react';
import { useSongStore } from '@/modules/song';
import { usePlaylistDetails } from '../../hooks';
import { toast } from 'sonner';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { IMAGE_PLACEHOLDER } from '@/constants/link';
import { Link } from '@/i18n/navigation';
import { Routes } from '@/constants/routes';

export function ViewPlaylistItem({ playlist }: { playlist: Playlist }): JSX.Element {
  const [playlistId, setPlaylistId] = useState<string | undefined>(undefined);

  const t = useTranslations<NextIntl.Namespace<'Component.playlist'>>('Component.playlist');
  const { setPlaylist } = useSongStore((state) => state);
  const {
    isSuccess,
    data: dataDetails,
    isLoading: isLoadingDetails,
  } = usePlaylistDetails(playlistId);

  useEffect(() => {
    if (isSuccess && dataDetails) {
      if (dataDetails.songs.length > 0) {
        setPlaylist(dataDetails.songs);
      } else {
        toast.info(t('empty'));
      }

      setPlaylistId(undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSuccess, dataDetails, setPlaylist]);

  return (
    <Link
      href={`${Routes.Playlist}/${playlist.id}`}
      className="flex items-center justify-between gap-3 py-1 px-2 rounded-md cursor-pointer transition-all hover:bg-neutral-800"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10">
          <Image
            alt={playlist.title}
            src={playlist.songs?.[0]?.cover?.url ?? playlist.cover ?? IMAGE_PLACEHOLDER}
            width={100}
            height={100}
            className="w-full h-full object-cover rounded-full"
          />
        </div>
        <div className="flex flex-col">
          <span className="font-semibold">{playlist.title}</span>
        </div>
      </div>
      <Button
        className="rounded-full w-8 h-8 shrink-0"
        onClick={(e) => {
          e.stopPropagation();
          setPlaylistId(playlist.id);
        }}
        size="icon"
        variant="ghost"
      >
        {isLoadingDetails ? (
          <Loader2Icon className="animate-spin" />
        ) : (
          <PlayIcon className="fill-primary stroke-primary" />
        )}
      </Button>
    </Link>
  );
}
