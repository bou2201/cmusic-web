'use client';

import { IMAGE_PLACEHOLDER } from '@/constants/link';
import { usePlaylistDetails } from '../hooks';
import Image from 'next/image';
import { DispAvatar } from '@/components/common';
import { formatDurationSum, getShortName, useSongStore } from '@/modules/song';
import { Link } from '@/i18n/navigation';
import { Routes } from '@/constants/routes';
import { useAuthStore } from '@/modules/auth';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';
import { Button } from '@/components/ui';
import { PencilIcon, PlayIcon, XIcon } from 'lucide-react';

export function PageDetails({ id }: { id: string }) {
  const { user } = useAuthStore((state) => state);
  const { setPlaylist } = useSongStore((state) => state);

  const { isSuccess, data: dataDetails, isLoading: isLoadingDetails } = usePlaylistDetails(id);
  const t = useTranslations<NextIntl.Namespace<'PlaylistPage.details'>>('PlaylistPage.details');

  return (
    <section className="h-full rounded-xl bg-sidebar overflow-x-hidden overflow-y-auto pt-16 relative">
      <div
        className="absolute inset-0 z-0 h-80"
        style={{
          backgroundImage: `url(${dataDetails?.cover ?? IMAGE_PLACEHOLDER})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'blur(50px)',
          opacity: 0.5,
        }}
      />

      <div className="grid grid-cols-6 justify-center items-start gap-14 px-20">
        <div className="col-span-2 flex flex-col justify-between items-center max-w-72">
          <div className="w-full h-full aspect-square shadow-2xl">
            <Image
              width={1000}
              height={1000}
              alt={dataDetails?.title ?? 'cover-playlist'}
              src={dataDetails?.cover ?? IMAGE_PLACEHOLDER}
              className="w-full h-full object-cover rounded-lg"
              unoptimized
            />
          </div>
          <h3
            className="text-2xl text-center font-bold line-clamp-3 truncate whitespace-normal mt-6"
            title={dataDetails?.title}
          >
            {dataDetails?.title}
          </h3>

          <div className="flex items-center gap-2 text-sm mt-4">
            <DispAvatar
              src={user?.avatar?.url ?? ''}
              alt={user?.name ?? ''}
              fallback={getShortName(user?.name ?? '')}
              className="object-cover"
            />
            <Link
              href={`${Routes.Artists}/${dataDetails?.userId}`}
              className="font-medium opacity-80 hover:underline"
            >
              {dataDetails?.userId === user?.id ? user?.name : 'Hệ thống'}
            </Link>
          </div>

          <p className="mt-5 text-muted-foreground font-semibold">
            {dataDetails?.songs.length} {t('tracks').toLocaleLowerCase()} •{' '}
            {formatDurationSum(dataDetails?.songs.map((song) => song.duration) ?? [])}
          </p>

          <div className="mt-5 flex justify-center items-center gap-6">
            <Button variant="secondary" size="icon" className="rounded-full w-10 h-10">
              <PencilIcon />
            </Button>
            <Button
              onClick={() => {
                setPlaylist(dataDetails?.songs ?? []);
              }}
              size="icon"
              className="h-16 w-16 rounded-full bg-primary hover:bg-primary-pink group"
              variant="outline"
            >
              <PlayIcon className="fill-background stroke-background group-hover:fill-primary group-hover:stroke-primary !w-6 !h-6" />
            </Button>
            <Button variant="secondary" size="icon" className="rounded-full w-10 h-10">
              <XIcon />
            </Button>
          </div>
        </div>

        <div className="col-span-4">2</div>
      </div>
    </section>
  );
}
