'use client';

import { Button, Carousel, CarouselContent, CarouselNext, CarouselPrevious } from '@/components/ui';
import { ArrowRight } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { NextIntl } from '~types/next-intl';

type SectionBannerProps = {
  title: string;
  children: React.ReactNode;
  onClickViewAll?: React.MouseEventHandler<HTMLButtonElement>;
};

export function SectionBanner({ title, children, onClickViewAll }: SectionBannerProps) {
  const t = useTranslations<NextIntl.Namespace<'Section'>>('Section');

  return (
    <section className="py-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="md:text-xl lg:text-2xl font-bold opacity-90">{title}</h3>
        <Button
          type="button"
          variant="link"
          onClick={onClickViewAll}
          className="opacity-70 py-0 text-xs hover:opacity-90 hover:text-primary-pink transition-all"
        >
          {t('banner.viewAll')}
          <ArrowRight className="!w-3 !h-3" />
        </Button>
      </div>
      <Carousel
        opts={{
          align: 'start',
        }}
        className="w-full"
      >
        <CarouselContent>{children}</CarouselContent>
        <div className="absolute top-1/2 left-2 flex items-center justify-center">
          <CarouselPrevious className="relative -left-1 translate-x-0 hover:translate-x-0" />
        </div>
        <div className="absolute top-1/2 right-2 flex items-center justify-center">
          <CarouselNext className="relative -right-1 translate-x-0 hover:translate-x-0" />
        </div>
      </Carousel>
    </section>
  );
}
