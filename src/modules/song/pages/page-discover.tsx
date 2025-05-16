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

const GET_LIMIT_SONG = 8;
const GET_LIMIT_ARTIST = 16;

export function PageDiscover() {
  const t = useTranslations<NextIntl.Namespace<'Section'>>('Section');

  const { data: songResults, isLoading: songLoading } = useQuery({
    queryKey: ['song', 'discover', GET_LIMIT_SONG],
    queryFn: () => songService.getListSong({ page: 1, limit: GET_LIMIT_SONG }),
  });

  const { data: artistResults, isLoading: aristLoading } = useQuery({
    queryKey: ['artist', 'discover', GET_LIMIT_ARTIST],
    queryFn: () => artistService.getListArtist({ page: 1, limit: GET_LIMIT_ARTIST }),
  });

  return (
    <div>
      <SectionBanner title={t('song.featuredSong')}>
        {songLoading ? (
          <SectionSongSkeleton quantity={6} />
        ) : (
          songResults?.data?.map((song) => (
            <CarouselItem className="md:basis-1/4 lg:basis-72" key={song.id}>
              <SectionSong song={song} />
            </CarouselItem>
          ))
        )}
      </SectionBanner>

      <SectionBanner title={t('song.featuredArtist')}>
        {aristLoading ? (
          <SectionArtistSkeleton quantity={10} />
        ) : (
          artistResults?.data?.map((artist) => (
            <CarouselItem className="md:basis-1/4 lg:basis-52" key={artist.id}>
              <SectionArtist artist={artist} />
            </CarouselItem>
          ))
        )}
      </SectionBanner>
    </div>
  );
}
