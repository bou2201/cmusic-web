import { Routes } from '@/constants/routes';
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

export function getChangedFields<T extends object>(original: T, updated: T): Partial<T> {
  const changed: Partial<T> = {};

  for (const key in updated) {
    if (updated[key] !== original[key]) {
      changed[key] = updated[key];
    }
  }

  return changed;
}

export function getSmartChangedFields<T>(original: T, updated: T): Partial<T> {
  const changed: Partial<T> = {};

  const isObject = (val: any) => val !== null && typeof val === 'object' && !Array.isArray(val);
  const isEqualArray = (a: any[], b: any[]) => {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (isObject(a[i]) && isObject(b[i])) {
        if (Object.keys(getSmartChangedFields(a[i], b[i])).length > 0) return false;
      } else if (a[i] !== b[i]) return false;
    }
    return true;
  };

  for (const key in updated) {
    const originalValue = original?.[key];
    const updatedValue = updated?.[key];

    if (Array.isArray(originalValue) && Array.isArray(updatedValue)) {
      if (!isEqualArray(originalValue, updatedValue)) {
        changed[key] = updatedValue;
      }
    } else if (isObject(originalValue) && isObject(updatedValue)) {
      const nested = getSmartChangedFields(originalValue, updatedValue);
      if (nested && Object.keys(nested).length > 0) {
        (changed as any)[key] = nested;
      }
    } else if (originalValue !== updatedValue) {
      changed[key] = updatedValue;
    }
  }

  return changed;
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

export function getArtistInfo(
  artist: Artist,
  featArtist: Artist[] = [],
  admin?: boolean,
): Array<{ name: string; href: string }> {
  if (featArtist && featArtist.length > 0) {
    const allArtists = [artist, ...featArtist];
    return allArtists.map((art) => ({
      name: art.name,
      href: admin ? `${Routes.AdminArtists}/update?id=${art.id}` : `${Routes.Artists}/${art.id}`,
    }));
  }

  return [
    {
      name: artist.name,
      href: admin
        ? `${Routes.AdminArtists}/update?id=${artist.id}`
        : `${Routes.Artists}/${artist.id}`,
    },
  ];
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (!navigator?.clipboard) {
    console.warn('Clipboard API No Support.');
    return false;
  }

  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error('Error.', err);
    return false;
  }
}
