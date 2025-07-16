'use client';

import { Routes } from '@/constants/routes';
import { Link } from '@/i18n/navigation';
import { Genre } from '@/modules/genre';
import Image from 'next/image';

export function SectionGenre({ genre }: { genre: Genre }) {
  return (
    <div
      className="group flex flex-col items-center gap-4 p-4 rounded-md hover:bg-neutral-800 transition cursor-pointer w-auto"
      onClick={() => {}}
    >
      <div className="relative aspect-square w-full rounded-md overflow-hidden">
        <Image
          src="/images/song-default-white.png"
          alt={genre.name}
          fill
          className="object-cover"
        />
      </div>
      <Link href={'#'} className="font-semibold line-clamp-2 w-full hover:underline">
        {genre.name}
      </Link>
    </div>
  );
}
