'use client';

import { useQuery } from '@tanstack/react-query';
import { songService } from '../service';
import { CarouselItem } from '@/components/ui';
import {
  SectionAlbum,
  SectionArtist,
  SectionArtistSkeleton,
  SectionBanner,
  SectionGenre,
  SectionSong,
  SectionSongSkeleton,
} from '@/components/common';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { artistService } from '@/modules/artist';
import { useSongStore } from '../store';
import { genreService } from '@/modules/genre';
import { albumService } from '@/modules/album';
import { LayoutFooter } from '@/components/layout/layout-footer';

const GET_LIMIT_SONG = 20;
const GET_LIMIT_ARTIST = 20;
const GET_LIMIT_ALBUM = 10;
const GET_LIMIT_GENRE = 10;
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

  const { data: albumResults, isLoading: albumLoading } = useQuery({
    queryKey: ['album', 'discover', GET_LIMIT_ALBUM],
    queryFn: () => albumService.getListAlbum({ page: 1, limit: GET_LIMIT_ALBUM }),
  });

  const { data: genreResults, isLoading: genreLoading } = useQuery({
    queryKey: ['genre', 'discover', GET_LIMIT_GENRE],
    queryFn: () => genreService.getListGenre({ page: 1, limit: GET_LIMIT_GENRE }),
  });

  return (
    <div className="h-full rounded-xl bg-sidebar overflow-x-hidden overflow-y-auto lg:px-5">
      {recentTracks.length > 0 ? (
        <SectionBanner title={t('song.listenAgain')} isCarousel={false} isViewAll={false}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-2">
            {recentTracks.slice(0, SHOW_LIMIT_RECENT_SONG).map((rec) => (
              <SectionSong song={rec} size="small" key={rec.id} />
            ))}
          </div>
        </SectionBanner>
      ) : null}

      <SectionBanner title={t('song.featuredSong')} isViewAll={false}>
        {songLoading ? (
          <SectionSongSkeleton quantity={6} />
        ) : (
          songResults?.data?.map((song) => (
            <CarouselItem className="basis-44 md:basis-52 lg:basis-56" key={song.id}>
              <SectionSong song={song} size="large" />
            </CarouselItem>
          ))
        )}
      </SectionBanner>

      <SectionBanner title={t('song.featuredAlbum')} isViewAll={false}>
        {albumLoading ? (
          <SectionSongSkeleton quantity={4} />
        ) : (
          albumResults?.data?.map((album) => (
            <CarouselItem className="basis-44 md:basis-52 lg:basis-56" key={album.id}>
              <SectionAlbum album={album} />
            </CarouselItem>
          ))
        )}
      </SectionBanner>

      <SectionBanner title={t('song.featuredArtist')} isViewAll={false}>
        {aristLoading ? (
          <SectionArtistSkeleton quantity={10} />
        ) : (
          artistResults?.data?.map((artist) => (
            <CarouselItem className="basis-44 md:basis-52 lg:basis-56" key={artist.id}>
              <SectionArtist artist={artist} size="large" />
            </CarouselItem>
          ))
        )}
      </SectionBanner>

      <SectionBanner title={t('song.genre')} isViewAll={false}>
        {genreLoading ? (
          <SectionSongSkeleton quantity={4} />
        ) : (
          genreResults?.data?.map((genre) => (
            <CarouselItem className="basis-44 md:basis-52 lg:basis-56" key={genre.id}>
              <SectionGenre genre={genre} />
            </CarouselItem>
          ))
        )}
      </SectionBanner>

      <LayoutFooter />
    </div>
  );
}
