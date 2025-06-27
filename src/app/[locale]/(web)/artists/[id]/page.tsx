import { artistService, PageDetails } from '@/modules/artist';
import { Metadata } from 'next';

type Params = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const art = await artistService.getArtistById(id);

  return {
    title: art.name,
    description: art.bio,
    openGraph: {
      title: art.name,
      description: art.bio,
      images: [
        {
          url: art.avatar.url ?? '',
          width: 1200,
          height: 630,
          alt: art.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: art.name,
      description: art.bio,
      images: [art.avatar.url ?? ''],
    },
  };
}

export default async function Page({ params }: Params) {
  const { id } = await params;

  return <PageDetails id={id} />;
}
