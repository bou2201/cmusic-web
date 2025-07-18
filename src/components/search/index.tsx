'use client';

import { artistService } from '@/modules/artist';
import { songService } from '@/modules/song';
import { useQuery } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { useSearchParams } from 'next/navigation';
import { NextIntl } from '~types/next-intl';
import { DispEmpty, SectionArtist, SectionSong } from '../common';

export function PageSearch() {
  const t = useTranslations<NextIntl.Namespace<'SearchPage.page'>>('SearchPage.page');
  const searchParams = useSearchParams();
  const query: string = searchParams.get('q') ?? '';

  const {
    data: songResults,
    isLoading: loadingSong,
    isSuccess: successSong,
  } = useQuery({
    queryKey: ['song', query],
    queryFn: () => songService.getListSong({ page: 1, limit: 100, search: query }),
    enabled: !!query,
  });

  const {
    data: artistResults,
    isLoading: loadingArtist,
    isSuccess: successArtist,
  } = useQuery({
    queryKey: ['artist', query],
    queryFn: () => artistService.getListArtist({ page: 1, limit: 100, search: query }),
    enabled: !!query,
  });

  return (
    <section className="h-full bg-sidebar rounded-xl p-4 overflow-x-hidden overflow-y-auto">
      <div className="text-xl opacity-75">
        <span className="font-medium">{t('keyword')}</span>{' '}
        <span className="font-bold">{`'${query}'`}</span>
      </div>

      {songResults?.data && songResults?.data?.length > 0 && (
        <div className="my-6">
          <h2 className="font-semibold text-2xl opacity-90 mb-6">{t('resultSong')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {songResults.data.map((song) => (
              <SectionSong song={song} size="small" key={song.id} />
            ))}
          </div>
        </div>
      )}

      {artistResults?.data && artistResults?.data?.length > 0 && (
        <div className="my-6">
          <h2 className="font-semibold text-2xl opacity-90 mb-6">{t('resultArtist')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
            {artistResults.data.map((artist) => (
              <SectionArtist artist={artist} size="small" key={artist.id} />
            ))}
          </div>
        </div>
      )}

      {songResults?.meta.total === 0 && artistResults?.meta.total === 0 && <DispEmpty />}
    </section>
  );
}
