import { useSongStore } from '../store';
import { Song } from '../types';

// Get initial values player audio from localStorage if available
export const getInitialVolume = () => {
  if (typeof window !== 'undefined') {
    const savedVolume = localStorage.getItem('audio-player-volume');
    return savedVolume ? parseFloat(savedVolume) : 1;
  }
  return 1;
};

export const getInitialShuffle = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('audio-player-shuffle') === 'true';
  }
  return false;
};

export const getInitialRepeatMode = () => {
  if (typeof window !== 'undefined') {
    const savedMode = localStorage.getItem('audio-player-repeat') as 'off' | 'all' | 'one';
    return savedMode || 'off';
  }
  return 'off';
};

export const getInitialRecentTracks = (): Song[] => {
  if (typeof window !== 'undefined') {
    try {
      const savedTracks = localStorage.getItem('recentTracks');
      return savedTracks ? JSON.parse(savedTracks) : [];
    } catch (error) {
      console.error('Error loading recent tracks from localStorage:', error);
      return [];
    }
  }
  return [];
};

// Function to save recent tracks to localStorage
export const saveRecentTracks = (tracks: Song[]) => {
  try {
    localStorage.setItem('recentTracks', JSON.stringify(tracks));
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
