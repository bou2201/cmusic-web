import { albumService, PageDetails } from '@/modules/album';
import { Metadata } from 'next';

type Params = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const album = await albumService.getAlbumById(id);

  return {
    title: `${album.title} - ${album.description ?? ''}`,
    description: album.title,
    openGraph: {
      title: `${album.title} - ${album.description ?? ''}`,
      description: album.title,
      images: [
        {
          url: album.cover?.url ?? '',
          width: 1200,
          height: 630,
          alt: album.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${album.title} - ${album.description ?? ''}`,
      description: album.title,
      images: [album.cover?.url ?? ''],
    },
  };
}

export default async function Page({ params }: Params) {
  const { id } = await params;

  return <PageDetails id={id} />;
}
