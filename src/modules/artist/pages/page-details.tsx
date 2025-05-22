'use client';

import { useQuery } from '@tanstack/react-query';
import { artistService } from '../service';
import { SectionDetails } from '@/components/common';

export function PageDetails({ id }: { id: string }) {
  const { data: artist, isLoading } = useQuery({
    queryKey: ['artist-details', id],
    queryFn: () => artistService.getArtistById(id),
  });

  const renderHeaderContent = () => {
    return (
      <div className="flex flex-col gap-2 py-2">
        <h1 className="md:text-2xl lg:text-3xl xl:text-[42px] font-bold leading-[normal] line-clamp-2">
          {artist?.name}
        </h1>
        <div className="mt-4 text-sm"></div>
      </div>
    );
  };

  return (
    <SectionDetails
      headerImage={{
        alt: artist?.name ?? '',
        url: artist?.avatar.url ?? '',
      }}
      type="artist"
      headerContent={renderHeaderContent()}
    >
      <></>
    </SectionDetails>
  );
}
