'use client';

import { IMAGE_PLACEHOLDER } from '@/constants/link';
import { Routes } from '@/constants/routes';
import { Link } from '@/i18n/navigation';
import { Genre } from '@/modules/genre';
import Image from 'next/image';

export function SectionGenre({ genre }: { genre: Genre }) {
  return (
    <Link
      href={Routes.Genres + '/' + genre.id}
      className="group flex flex-col items-center gap-4 p-3 rounded-md hover:bg-neutral-800 transition cursor-pointer w-auto"
    >
      <div className="relative aspect-square w-full rounded-md overflow-hidden">
        <Image src={IMAGE_PLACEHOLDER} alt={genre.name} fill className="object-cover" />
      </div>
      <Link
        href={Routes.Genres + '/' + genre.id}
        className="font-medium line-clamp-2 w-full hover:underline"
      >
        {genre.name}
      </Link>
    </Link>
  );
}
