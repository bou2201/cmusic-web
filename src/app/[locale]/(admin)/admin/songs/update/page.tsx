import { FormCouMnt } from '@/modules/song';

interface Params {
  searchParams: {
    id?: string;
  };
}

export default async function Page({ searchParams }: Params) {
  const { id } = await searchParams;

  return <FormCouMnt id={id} />;
}
