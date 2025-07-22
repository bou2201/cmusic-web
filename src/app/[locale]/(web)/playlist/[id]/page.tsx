import { PageDetails } from '@/modules/playlist';

type Params = {
  params: Promise<{ id: string }>;
};

export default async function Page({ params }: Params) {
  const { id } = await params;

  return <PageDetails id={id} />;
}
