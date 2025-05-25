'use client';

import { useQuery } from '@tanstack/react-query';
import { songService } from '../service';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { Button } from '@/components/ui';
import { DispAvatar, SectionDetails } from '@/components/common';
import { formatNumber, getShortName, processLyricsWithViewMore } from '../utils/function';
import { Link, useRouter } from '@/i18n/navigation';
import { Routes } from '@/constants/routes';
import { formatDuration } from '@/utiils/function';
import { useSongStore } from '../store';
import { Song } from '../types';
import { Heart, Play } from 'lucide-react';
import { useState } from 'react';
import { Artist } from '@/modules/artist';

export function PageDetails({ id }: { id: string }) {
  const [showFullLyrics, setShowFullLyrics] = useState<boolean>(false);

  const t = useTranslations<NextIntl.Namespace<'SongsPage.songDetails'>>('SongsPage.songDetails');
  const tSection = useTranslations<NextIntl.Namespace<'Section.artist'>>('Section.artist');
  const setTrack = useSongStore((state) => state.setTrack);
  const router = useRouter();

  const { data: song, isLoading } = useQuery({
    queryKey: ['song-details', id],
    queryFn: () => songService.getSongById(id),
  });

  const { html: lyricsHtml, hasMoreLines } = processLyricsWithViewMore(
    song?.lyrics,
    14,
    showFullLyrics,
  );

  const renderHeaderContent = () => {
    return (
      <div className="flex flex-col gap-2 py-2">
        <h5 className="font-bold">{t('title')}</h5>
        <h1 className="md:text-2xl lg:text-3xl xl:text-[42px] font-bold leading-[normal] line-clamp-2">
          {song?.title}
        </h1>
        <div className="flex items-center gap-2 mt-4 text-sm">
          <DispAvatar
            src={song?.artist.avatar.url ?? ''}
            alt={song?.artist.name ?? ''}
            fallback={getShortName(song?.artist.name ?? '')}
            className="object-cover"
          />
          <Link
            href={`${Routes.Artists}/${song?.artist.id}`}
            className="font-bold opacity-80 hover:underline"
          >
            {song?.artist.name}
          </Link>
          •<span className="font-semibold opacity-80">{formatDuration(song?.duration ?? 0)}</span>•
          <span className="font-semibold opacity-80">{formatNumber(song?.playCount ?? 0)}</span>
        </div>
      </div>
    );
  };

  if(!song) return null;

  return (
    <SectionDetails
      headerImage={{
        alt: song?.title ?? '',
        url: song?.cover?.url ?? '',
      }}
      type="song"
      headerContent={renderHeaderContent()}
    >
      <div className="flex items-center gap-5">
        <Button
          onClick={() => {
            setTrack(song as Song);
          }}
          size="icon"
          className="rounded-full w-14 h-14 bg-primary-pink hover:bg-primary-pink/80 group"
        >
          <Play className="fill-primary stroke-primary !h-6 !w-6" />
        </Button>

        <Button variant="ghost" size="icon" className="w-12 h-12 rounded-full">
          <Heart className="!w-6 !h-6 opacity-80" />
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-5">
        <div className="col-span-2 xl:col-span-1">
          <h3 className="font-bold my-6 text-2xl">{t('lyrics')}</h3>
          <div
            dangerouslySetInnerHTML={{
              __html: lyricsHtml,
            }}
            className="text-[#a5a5a5] font-semibold"
          />
          {hasMoreLines && (
            <Button
              variant="link"
              className="flex items-center gap-2 !px-0 hover:opacity-80"
              onClick={() => {
                setShowFullLyrics(!showFullLyrics);
              }}
            >
              <span className="font-bold opacity-90">
                {!showFullLyrics ? `...${t('showMore')}` : t('showLess')}
              </span>
            </Button>
          )}
        </div>

        <div className="flex flex-col gap-3 col-span-2 xl:col-span-1">
          {[song?.artist, ...((song?.artists as Artist[]) ?? [])].map((art) => (
            <div
              className="flex items-center gap-5 p-3 rounded-md hover:bg-neutral-800 transition cursor-pointer"
              key={art?.id}
              onClick={() => {
                router.push(`${Routes.Artists}/${art?.id}`);
              }}
            >
              <div className="w-16 h-16">
                <Image
                  alt={art?.name ?? ''}
                  src={art?.avatar?.url ?? ''}
                  width={200}
                  height={200}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-[#a5a5a5] text-sm">{tSection('role')}</span>
                <Link href={`${Routes.Artists}/${art?.id}`} className="font-bold hover:underline">
                  {art?.name}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SectionDetails>
  );
}
