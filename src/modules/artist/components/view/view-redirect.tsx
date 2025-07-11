'use client';

import { getArtistInfo } from '@/utiils/function';
import { Artist } from '../../types';
import { Fragment } from 'react';
import { Link } from '@/i18n/navigation';

type ViewRedirectArtistProps = {
  artist: Artist;
  artists: Artist[];
  className?: string;
  admin?: boolean;
};

export function ViewRedirectArtist({ artist, artists, className, admin }: ViewRedirectArtistProps) {
  const infor = getArtistInfo(artist, artists, admin);

  return infor.map((art, index) => (
    <Fragment key={art.name}>
      <Link
        href={art.href}
        className={`font-medium text-sm text-zinc-400 hover:underline ${className ?? ''}`}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        {art.name}
      </Link>
      {index < infor.length - 1 && (
        <span className={`font-medium text-sm text-zinc-400 ${className ?? ''}`}>, </span>
      )}
    </Fragment>
  ));
}
