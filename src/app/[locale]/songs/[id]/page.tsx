export default function Page({ params }: { params: { id: string } }) {
  return (
    <div>
      <h1>Page {params.id}</h1>
    </div>
  );
}
