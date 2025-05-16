import { Artist } from '@/modules/artist';

export function objectToQueryString(params: Record<string, any>): string {
  const cleaned = Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) =>
        value !== null &&
        value !== undefined &&
        value !== '' &&
        !(Array.isArray(value) && value.length === 0),
    ),
  );

  // Optional: handle arrays by serializing them as comma-separated
  const processed = Object.fromEntries(
    Object.entries(cleaned).map(([key, value]) => [
      key,
      Array.isArray(value) ? value.join(',') : value,
    ]),
  );

  return new URLSearchParams(processed).toString();
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function getArtistName(artist: Artist, featArtist: Artist[]): string {
  if (featArtist) {
    const allArtist = [artist, ...featArtist];
    return allArtist.map((art) => art.name).join(', ');
  }

  return artist.name;
}
