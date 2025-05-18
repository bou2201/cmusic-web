'use client';

import { DispEmpty, SectionBanner, SectionSong } from '@/components/common';
import { useSongStore } from '../store';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';

export function PageRecently() {
  const recentTracks = useSongStore((state) => state.recentTracks);

  const t = useTranslations<NextIntl.Namespace<'RecentlyPlayedPage.section'>>(
    'RecentlyPlayedPage.section',
  );
  const tEmpty = useTranslations<NextIntl.Namespace<'Header.search'>>('Header.search');

  return (
    <SectionBanner isViewAll={false} isCarousel={false} title={t('title')}>
      {recentTracks.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {recentTracks.map((rec) => (
            <SectionSong size="large" song={rec} key={rec.id} />
          ))}
        </div>
      ) : (
        <DispEmpty />
      )}
    </SectionBanner>
  );
}
