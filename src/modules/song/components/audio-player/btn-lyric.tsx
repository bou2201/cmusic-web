'use client';

import { DispDrawer, DispEmpty, DispTooltip } from '@/components/common';
import { Button } from '@/components/ui';
import { MicVocal } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { NextIntl } from '~types/next-intl';
import { useSongStore } from '../../store';
import Image from 'next/image';
import { getArtistName } from '@/utiils/function';

export function BtnLyric() {
  const [openLyric, setOpenLyric] = useState<boolean>(false);

  const { track, isPlaying } = useSongStore((state) => state);
  const t = useTranslations<NextIntl.Namespace<'SongsPage.audioPlayer'>>('SongsPage.audioPlayer');
  const tSection = useTranslations<NextIntl.Namespace<'Section.artist'>>('Section.artist');

  return (
    <>
      <DispTooltip content={t('turnOnLyrics')}>
        <Button
          size="icon"
          variant="ghost"
          className="rounded-full"
          onClick={() => {
            setOpenLyric(true);
          }}
        >
          <MicVocal />
        </Button>
      </DispTooltip>

      <DispDrawer open={openLyric} setOpen={setOpenLyric} modal={false} className='px-10'>
        <div className="relative w-full h-screen">
          <div
            className="absolute inset-0 z-0"
            style={{
              backgroundImage: `url(${track?.cover?.url ?? '/images/song-default-white.png'})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'blur(80px)',
              opacity: 0.7,
            }}
          />

          <div className="relative z-10 container w-full h-screen mx-auto">
            <div className="grid grid-cols-5 py-6 gap-20 h-[80vh] items-center">
              <div
                className={`w-full h-auto col-span-2 aspect-square ${isPlaying ? 'animate-spin-disk' : ''}`}
              >
                <Image
                  width={1000}
                  height={1000}
                  alt={track?.title ?? ''}
                  src={track?.cover?.url ?? '/images/song-default-white.png'}
                  className="w-full h-full object-cover rounded-full"
                  unoptimized
                />
              </div>
              <div className="col-span-3">
                {track?.lyrics ? (
                  <div className="text-4xl text-primary/70 font-bold whitespace-pre-line overflow-y-auto max-h-[70vh] py-4 flex flex-col gap-8">
                    <div>{track.title}</div>
                    <div>
                      {tSection('role') + ': ' + getArtistName(track.artist, track.artists)}
                    </div>
                    <div>_</div>
                    {track.lyrics.split('\n').map((line, index) => (
                      <div key={index}>{line || <br />}</div>
                    ))}
                    <div>_</div>
                  </div>
                ) : (
                  <div className="text-4xl text-primary/70 font-bold">{t('noLyrics')}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DispDrawer>
    </>
  );
}
