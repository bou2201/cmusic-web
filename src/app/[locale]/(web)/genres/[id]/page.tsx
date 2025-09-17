import { genreService, PageDetails } from '@/modules/genre';
import { Metadata } from 'next';

type Params = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const art = await genreService.getGenreById(id);

  return {
    title: art?.name,
    description: art?.description,
    openGraph: {
      title: art?.name,
      description: art?.name,
    },
  };
}

export default async function Page({ params }: Params) {
  const { id } = await params;

  return <PageDetails id={id} />;
}
