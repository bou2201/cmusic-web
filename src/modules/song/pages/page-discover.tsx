'use client';

import { useQuery } from '@tanstack/react-query';
import { songService } from '../service';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui';
import { SectionSong } from '@/components/common';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';

const GET_LIMIT = 8;

export function PageDiscover() {
  const t = useTranslations<NextIntl.Namespace<'Section'>>('Section');

  const { data: songResults, isLoading: songLoading } = useQuery({
    queryKey: ['song', 'discover'],
    queryFn: () => songService.getListSong({ page: 1, limit: GET_LIMIT }),
  });

  // const {} = useQuery({
  //   queryKey: ['artist', 'discover'],
  //   queryFn: () =>
  // })

  return (
    <div>
      <section>
        <h3 className="md:text-xl lg:text-3xl font-semibold opacity-90 mb-4">{t('song.featuredSong')}</h3>
        <Carousel
          opts={{
            align: 'start',
          }}
          className="w-full"
        >
          <CarouselContent>
            {songResults?.data?.map((song) => (
              <CarouselItem className="md:basis-1/4 lg:basis-1/6" key={song.id}>
                <SectionSong song={song} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="absolute top-1/2 left-2 flex items-center justify-center">
            <CarouselPrevious className="relative left-0 translate-x-0 hover:translate-x-0" />
          </div>
          <div className="absolute top-1/2 right-2 flex items-center justify-center">
            <CarouselNext className="relative right-0 translate-x-0 hover:translate-x-0" />
          </div>
        </Carousel>
      </section>
    </div>
  );
}
