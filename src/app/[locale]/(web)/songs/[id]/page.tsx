import { PageDetails, songService } from '@/modules/song';
import { Metadata } from 'next';

type Params = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { id } = await params;
  const track = await songService.getSongById(id);

  return {
    title: `${track.title} - ${track.artist.name}`,
    description: track.title,
    openGraph: {
      title: `${track.title} - ${track.artist.name}`,
      description: track.title,
      images: [
        {
          url: track.cover?.url ?? '',
          width: 1200,
          height: 630,
          alt: track.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${track.title} - ${track.artist.name}`,
      description: track.title,
      images: [track.cover?.url ?? ''],
    },
  };
}

export default async function Page({ params }: Params) {
  const { id } = await params;

  return <PageDetails id={id} />;
}
