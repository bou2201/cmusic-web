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
