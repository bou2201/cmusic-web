'use client';

import { IMAGE_PLACEHOLDER } from '@/constants/link';
import { Routes } from '@/constants/routes';
import { Link } from '@/i18n/navigation';
import { Album } from '@/modules/album';
import Image from 'next/image';

export function SectionAlbum({ album }: { album: Album }) {
  return (
    <Link
      href={Routes.Albums + '/' + album.id}
      className="group flex flex-col items-center gap-4 p-3 rounded-md hover:bg-neutral-800 transition cursor-pointer w-auto"
    >
      <div className="relative aspect-square w-full rounded-md overflow-hidden">
        <Image
          src={album.cover?.url ?? IMAGE_PLACEHOLDER}
          alt={album.title}
          fill
          className="object-cover"
        />
      </div>
      <Link
        href={Routes.Albums + '/' + album.id}
        className="font-semibold line-clamp-2 w-full hover:underline"
      >
        {album.title}
      </Link>
    </Link>
  );
}
