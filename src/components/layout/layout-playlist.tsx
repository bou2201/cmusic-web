'use client';

import { useSongStore } from '@/modules/song';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { DispEmpty, SectionSongInPlaylist, SectionSongInPlayListPlaying } from '../common';

export function LayoutPlaylist() {
  const { track, playlist } = useSongStore((state) => state);

  const t = useTranslations<NextIntl.Namespace<'SongsPage.audioPlayer'>>('SongsPage.audioPlayer');

  return (
    <div
      className={`top-2 left-2 bg-sidebar rounded-xl w-80 h-[calc(100vh-88px)] overflow-y-auto ${track ? 'bottom-20' : 'bottom-2'}`}
    >
      <div className="py-4 px-2">
        {track ? (
          <>
            <h3 className="font-bold opacity-90 mb-5 px-2">{t('playing')}</h3>
            <SectionSongInPlayListPlaying song={track} />
          </>
        ) : null}

        <h3 className={`font-bold opacity-90 mb-5 px-2 ${track ? 'mt-5' : ''}`}>{t('playlist')}</h3>

        <div className="flex flex-col gap-2">
          {playlist.length > 0 ? (
            playlist.map((song, index) => (
              <SectionSongInPlaylist song={song} indexSong={index} key={song.id} />
            ))
          ) : (
            <DispEmpty title={t('noPlaylist')} />
          )}
        </div>
      </div>
    </div>
  );
}
