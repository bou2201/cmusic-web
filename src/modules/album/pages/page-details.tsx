'use client';

import { useQuery } from '@tanstack/react-query';
import { albumService } from '../service';
import { useLocale, useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { DispAvatar, DispLoading, SectionDetails } from '@/components/common';
import { Button } from '@/components/ui';
import {
  formatDateByLang,
  formatDurationSum,
  getShortName,
  Song,
  songService,
  useSongStore,
} from '@/modules/song';
import { PlayIcon } from 'lucide-react';
import { TablePopularTrack } from '@/modules/artist';
import { Link } from '@/i18n/navigation';
import { Locale } from '@/i18n/routing';

export function PageDetails({ id }: { id: string }) {
  const tSectionAlbum = useTranslations<NextIntl.Namespace<'Section.album'>>('Section.album');
  const locale = useLocale();

  const setPlaylist = useSongStore((state) => state.setPlaylist);

  const { data: album } = useQuery({
    queryKey: ['album-details', id],
    queryFn: () => albumService.getAlbumById(id),
  });

  const { data: songResults, isLoading: songLoading } = useQuery({
    queryKey: ['song', 'album-details', id],
    queryFn: () => songService.getListSong({ page: 1, limit: 10, albumId: id }),
  });

  const renderHeaderContent = () => {
    return (
      <div className="flex flex-col gap-2 py-2">
        <h5 className="font-bold">{tSectionAlbum('title')}.</h5>
        <h1 className="md:text-2xl lg:text-3xl xl:text-[42px] font-bold leading-[normal] line-clamp-2">
          {album?.title}
        </h1>
        <div className="mt-4 text-sm flex items-center gap-2">
          <DispAvatar
            src={songResults?.data?.[0].artist?.avatar.url ?? ''}
            alt={songResults?.data?.[0].artist?.name ?? ''}
            fallback={getShortName(songResults?.data?.[0].artist.name ?? '')}
            className="object-cover"
          />
          <Link
            className="font-bold text-sm text-primary/80 hover:underline ml-2"
            href={`/artists/${album?.artistId}`}
          >
            {songResults?.data?.[0].artist.name}
          </Link>
          •
          <span className="font-semibold opacity-60">
            {new Date(album?.releaseDate ?? '').getFullYear()}
          </span>
          •
          <span className="font-semibold opacity-60">
            {songResults?.data?.length} {tSectionAlbum('tracks').toLowerCase()},{' '}
            {formatDurationSum(songResults?.data?.map((song) => song.duration) ?? [])}
          </span>
        </div>
      </div>
    );
  };

  if (!album) return <DispLoading />;

  return (
    <SectionDetails
      headerImage={{
        alt: album?.title,
        url: album?.cover?.url ?? '',
      }}
      type="song"
      headerContent={renderHeaderContent()}
    >
      <div className="flex items-center gap-5">
        <Button
          variant="primary"
          onClick={() => {
            setPlaylist(songResults?.data as Song[]);
          }}
          size="icon"
          className="rounded-full w-14 h-14 group"
          disabled={!songResults}
        >
          <PlayIcon className="fill-primary stroke-primary !h-6 !w-6" />
        </Button>
      </div>

      <div className="my-10">
        <h3 className="font-bold mb-6 text-2xl">{tSectionAlbum('title')}</h3>
        <TablePopularTrack songLoading={songLoading} songResults={songResults} showArtistRedirect />
      </div>
      <span className="font-bold text-zinc-400 text-sm">
        {formatDateByLang(album.releaseDate, locale as Locale)}
      </span>
    </SectionDetails>
  );
}
