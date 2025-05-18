'use client';

import { useQuery } from '@tanstack/react-query';
import { songService } from '../service';
import { CarouselItem } from '@/components/ui';
import {
  SectionArtist,
  SectionArtistSkeleton,
  SectionBanner,
  SectionSong,
  SectionSongSkeleton,
} from '@/components/common';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { artistService } from '@/modules/artist';
import { useSongStore } from '../store';

const GET_LIMIT_SONG = 10;
const GET_LIMIT_ARTIST = 20;
const SHOW_LIMIT_RECENT_SONG = 9;

export function PageDiscover() {
  const t = useTranslations<NextIntl.Namespace<'Section'>>('Section');

  const recentTracks = useSongStore((state) => state.recentTracks);

  const { data: songResults, isLoading: songLoading } = useQuery({
    queryKey: ['song', 'discover', GET_LIMIT_SONG],
    queryFn: () => songService.getListSong({ page: 1, limit: GET_LIMIT_SONG, isTrending: true }),
  });

  const { data: artistResults, isLoading: aristLoading } = useQuery({
    queryKey: ['artist', 'discover', GET_LIMIT_ARTIST],
    queryFn: () =>
      artistService.getListArtist({ page: 1, limit: GET_LIMIT_ARTIST, isPopular: true }),
  });

  return (
    <div>
      {recentTracks.length > 0 ? (
        <SectionBanner title={t('song.listenAgain')} isCarousel={false} isViewAll={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {recentTracks.slice(0, SHOW_LIMIT_RECENT_SONG).map((rec) => (
              <SectionSong song={rec} size="small" key={rec.id} />
            ))}
          </div>
        </SectionBanner>
      ) : null}

      <SectionBanner title={t('song.featuredSong')}>
        {songLoading ? (
          <SectionSongSkeleton quantity={6} />
        ) : (
          songResults?.data?.map((song) => (
            <CarouselItem className="basis-52 md:basis-60 lg:basis-72" key={song.id}>
              <SectionSong song={song} size="large" />
            </CarouselItem>
          ))
        )}
      </SectionBanner>

      <SectionBanner title={t('song.featuredArtist')}>
        {aristLoading ? (
          <SectionArtistSkeleton quantity={10} />
        ) : (
          artistResults?.data?.map((artist) => (
            <CarouselItem className="basis-44 md:basis-48 lg:basis-52" key={artist.id}>
              <SectionArtist artist={artist} />
            </CarouselItem>
          ))
        )}
      </SectionBanner>
    </div>
  );
}
