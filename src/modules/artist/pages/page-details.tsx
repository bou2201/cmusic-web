'use client';

import { useQuery } from '@tanstack/react-query';
import { artistService } from '../service';
import { SectionDetails } from '@/components/common';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { Button } from '@/components/ui';
import { Play, Plus } from 'lucide-react';
import { TablePopularTrack } from '../components';
import { Song, songService, useSongStore } from '@/modules/song';
import { useState } from 'react';
import { AuthLogin, useAuthStore } from '@/modules/auth';
import Image from 'next/image';

export function PageDetails({ id }: { id: string }) {
  const [openLogin, setOpenLogin] = useState<boolean>(false);

  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const tSectionArt = useTranslations<NextIntl.Namespace<'Section.artist'>>('Section.artist');
  const tSectionSong = useTranslations<NextIntl.Namespace<'Section.song'>>('Section.song');

  const setPlayList = useSongStore((state) => state.setPlaylist);

  const { data: artist } = useQuery({
    queryKey: ['artist-details', id],
    queryFn: () => artistService.getArtistById(id),
  });

  const { data: songResults, isLoading: songLoading } = useQuery({
    queryKey: ['song', 'artist-details', id],
    queryFn: () => songService.getListSong({ page: 1, limit: 10, artistId: id }),
  });

  const renderHeaderContent = () => {
    return (
      <div className="flex flex-col gap-2 py-2">
        <h5 className="font-bold">{tSectionArt('role')}.</h5>
        <h1 className="md:text-2xl lg:text-3xl xl:text-[42px] font-bold leading-[normal] line-clamp-2">
          {artist?.name}
        </h1>
        <div className="mt-4 text-sm flex items-center gap-10">
          <span className="font-semibold opacity-80">{`${artist?._count.followers} ${tSectionArt('followers').toLowerCase()}`}</span>
          <Button
            variant="primary"
            className="font-bold"
            onClick={() => {
              setOpenLogin(true);
            }}
          >
            <Plus /> {tSectionArt('follow')}
          </Button>
        </div>
      </div>
    );
  };

  if (!artist) return null;

  return (
    <>
      <SectionDetails
        headerImage={{
          alt: artist?.name,
          url: artist?.avatar.url,
        }}
        type="artist"
        headerContent={renderHeaderContent()}
      >
        <div className="flex items-center gap-5">
          <Button
            variant="primary"
            onClick={() => {
              setPlayList(songResults?.data as Song[]);
            }}
            size="icon"
            className="rounded-full w-14 h-14 group"
            disabled={!songResults}
          >
            <Play className="fill-primary stroke-primary !h-6 !w-6" />
          </Button>
        </div>

        <div className="my-10">
          <h3 className="font-bold mb-6 text-2xl">{tSectionSong('featuredSong')}</h3>
          <TablePopularTrack songLoading={songLoading} songResults={songResults} />
        </div>

        <div className="my-10">
          <h3 className="font-bold mb-6 text-2xl">
            {tSectionSong('about')} {artist.name}
          </h3>
          <div className="grid grid-cols-2 xl:grid-cols-5 gap-8 max-w-4xl">
            <div className="col-span-2 max-h-60">
              <Image
                width={400}
                height={400}
                alt={artist?.name}
                src={artist?.avatar.url}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <div className="col-span-2 xl:col-span-3">
              <p className="text-[#a5a5a5] text-sm font-semibold">{artist.bio}</p>
            </div>
          </div>
        </div>
      </SectionDetails>

      {openLogin ? <AuthLogin open={openLogin} setOpen={setOpenLogin} /> : null}
    </>
  );
}
