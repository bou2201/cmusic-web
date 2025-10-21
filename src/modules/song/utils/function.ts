import { KeySongStore } from '../constants/key-store';
import { RepeatMode, Song } from '../types';

// Get initial values player audio from localStorage if available
export const getInitialVolume = () => {
  if (typeof window !== 'undefined') {
    const savedVolume = localStorage.getItem(KeySongStore.Volume);
    return savedVolume ? parseFloat(savedVolume) : 1;
  }
  return 1;
};

export const getInitialShuffle = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(KeySongStore.Shuffle) === 'true';
  }
  return false;
};

export const getInitialRepeatMode = () => {
  if (typeof window !== 'undefined') {
    const savedMode = localStorage.getItem(KeySongStore.Repeat) as RepeatMode;
    return savedMode || 'none';
  }
  return 'none';
};

export const getInitialIsPlaylistOpen = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(KeySongStore.PlaylistOpen) === 'true';
  }
  return false;
};

export const getInitialRecentTracks = (): Song[] => {
  if (typeof window !== 'undefined') {
    try {
      const savedTracks = localStorage.getItem(KeySongStore.RecentTracks);
      return savedTracks ? JSON.parse(savedTracks) : [];
    } catch (error) {
      console.error('Error loading recent tracks from localStorage:', error);
      return [];
    }
  }
  return [];
};

export const getInitialPlaylist = (): Song[] => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(KeySongStore.CurrentPlaylist);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading playlist from localStorage:', error);
    }
  }
  return [];
};

export const getInitialCurrentTrackIndex = (): number => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(KeySongStore.CurrentTrackIndex);
    return saved ? parseInt(saved, 10) : 0;
  }
  return 0;
};

export const getInitialTrack = (): Song | null => {
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(KeySongStore.CurrentTrack);
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.error('Error loading current track from localStorage:', error);
    }
  }
  return null;
};

export const getInitialTrackIsLiked = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(KeySongStore.CurrentTrackIsLiked) === 'true';
  }
  return false;
};

// Function to save recent tracks to localStorage
export const saveRecentTracks = (tracks: Song[]) => {
  try {
    localStorage.setItem(KeySongStore.RecentTracks, JSON.stringify(tracks));
  } catch (error) {
    console.error('Error saving recent tracks to localStorage:', error);
  }
};

// Helper function to add a track to recent tracks
export const addTrackToRecent = (recentTracks: Song[], newTrack: Song): Song[] => {
  // Remove the track if it already exists
  const filteredTracks = recentTracks.filter((track) => track.id !== newTrack.id);

  // Add the new track to the beginning
  const updatedTracks = [newTrack, ...filteredTracks].slice(0, 12); // Limit to 12 tracks

  // Save to localStorage
  saveRecentTracks(updatedTracks);

  return updatedTracks;
};

export const getShortName = (fullname: string) => {
  if (!fullname || fullname.trim() === '') {
    return '';
  }
  const words = fullname.split(' ');
  let shortName = '';

  for (const word of words) {
    if (word) {
      shortName += word[0];
    }
  }

  return shortName.toUpperCase();
};

export function formatNumber(value: number | string): string {
  const number = typeof value === 'string' ? parseFloat(value) : value;

  if (isNaN(number)) return '0';

  return number.toLocaleString('vi-VN');
}

export function formatDurationSum(durations: number[]): string {
  const totalSeconds = durations.reduce((acc, val) => acc + val, 0);

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts: string[] = [];

  if (hours > 0) {
    parts.push(`${hours} giờ`);
  }
  if (minutes > 0) {
    parts.push(`${minutes} phút`);
  }
  if (seconds > 0 && parts.length === 0) {
    // chỉ thêm giây nếu không có giờ và phút
    parts.push(`${seconds} giây`);
  }

  return parts.join(', ');
}

/**
 * Format date string based on language (vi or en)
 * @param dateString ISO date string (e.g. "2024-12-11T17:00:00.000Z")
 * @param lang "vi" | "en" (default: "vi")
 * @returns Formatted date string
 *  - vi → "11 tháng 12, 2024"
 *  - en → "December 11, 2024"
 */
export function formatDateByLang(dateString: string, lang: 'vi' | 'en' = 'vi'): string {
  const date = new Date(dateString);

  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }

  if (lang === 'vi') {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return `${day} tháng ${month}, ${year}`;
  }

  // English format using Intl API for proper month names
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Processes lyrics to support "View More" functionality
 * @param lyrics The raw lyrics text
 * @param maxLines Maximum number of lines to show initially
 * @param showAll Whether to show all lines or just the limited number
 * @returns Processed lyrics with HTML formatting and information about whether there are more lines
 */
export function processLyricsWithViewMore(
  lyrics?: string,
  maxLines: number = 12,
  showAll: boolean = false,
): {
  html: string;
  hasMoreLines: boolean;
} {
  if (!lyrics) return { html: '', hasMoreLines: false };

  const lines = lyrics.split('\n');
  const hasMoreLines = lines.length > maxLines;

  let displayedLyrics;
  if (hasMoreLines && !showAll) {
    displayedLyrics = lines.slice(0, maxLines).join('\n');
  } else {
    displayedLyrics = lyrics;
  }

  return {
    html: displayedLyrics.replace(/\n/g, '<br />'),
    hasMoreLines,
  };
}

export function isCurrentlyPlaying(
  song: Song,
  options: {
    track: Song | null;
    playlist: Song[];
    currentTrackIndex: number;
    isPlaying: boolean;
  },
): boolean {
  const { track, playlist, currentTrackIndex, isPlaying } = options;

  return (
    isPlaying && ((track && track.id === song.id) || playlist[currentTrackIndex]?.id === song.id)
  );
}
