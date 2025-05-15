'use client';

import { Carousel, CarouselContent, CarouselNext, CarouselPrevious } from '@/components/ui';

type SectionBannerProps = {
  title: string;
  children: React.ReactNode;
};

export function SectionBanner({ title, children }: SectionBannerProps) {
  return (
    <section>
      <h3 className="md:text-xl lg:text-2xl font-bold opacity-90 mb-4">{title}</h3>
      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full"
      >
        <CarouselContent>{children}</CarouselContent>
        <div className="absolute top-1/2 left-2 flex items-center justify-center">
          <CarouselPrevious className="relative left-0 translate-x-0 hover:translate-x-0" />
        </div>
        <div className="absolute top-1/2 right-2 flex items-center justify-center">
          <CarouselNext className="relative right-0 translate-x-0 hover:translate-x-0" />
        </div>
      </Carousel>
    </section>
  );
}
