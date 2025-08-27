import { create } from 'zustand';
import { Song, SongFilter } from '../types';
import {
  addTrackToRecent,
  getInitialCurrentTrackIndex,
  getInitialPlaylist,
  getInitialRecentTracks,
  getInitialRepeatMode,
  getInitialShuffle,
  getInitialTrack,
  getInitialVolume,
} from '../utils/function';

type SongState = {
  audioElement: HTMLAudioElement | null;
  track: Song | null;
  playlist: Song[];
  currentTrackIndex: number;
  isLoading: boolean;
  recentTracks: Song[];
  isPlaying: boolean;
  volume: number;
  isShuffle: boolean;
  repeatMode: 'off' | 'all' | 'one';
  openPlayList: boolean;
  filters: Omit<SongFilter, 'page' | 'limit'>;
};

type SongAction = {
  setAudioElement: (element: HTMLAudioElement | null) => void;
  playAudio: () => void;
  pauseAudio: () => void;
  setTrack: (track: Song) => void;
  clearTrack: () => void;
  setPlaylist: (playlist: Song[], startIndex?: number) => void;
  addToPlaylist: (track: Song) => void;
  playNext: (track: Song) => void;
  nextTrack: (specificIndex?: number) => void;
  previousTrack: () => void;
  addToRecentTracks: (track: Song) => void;
  clearRecentTracks: () => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsPlaying: (isPlaying: boolean) => void;
  setVolume: (volume: number) => void;
  setIsShuffle: (isShuffle: boolean) => void;
  setRepeatMode: (repeatMode: 'off' | 'all' | 'one') => void;
  setOpenPlayList: (openPlayList: boolean) => void;
  setFilters: (filters: Omit<SongFilter, 'page' | 'limit'>) => void;
};

const initialValues: SongState = {
  audioElement: null,
  track: getInitialTrack(),
  playlist: getInitialPlaylist(),
  currentTrackIndex: getInitialCurrentTrackIndex(),
  isLoading: false,
  recentTracks: getInitialRecentTracks(),
  isPlaying: false,
  volume: getInitialVolume(),
  isShuffle: getInitialShuffle(),
  repeatMode: getInitialRepeatMode(),
  openPlayList: true,
  filters: {
    search: undefined,
    artistId: undefined,
    albumId: undefined,
    genreId: undefined,
    isTrending: undefined,
    isExplicit: undefined,
  },
};

export const useSongStore = create<SongState & SongAction>((set, get) => ({
  ...initialValues,
  setTrack: (track: Song) => {
    const { playlist } = get();
    const index = playlist.findIndex((s) => s.id === track.id);

    if (index !== -1) {
      // ✅ đã có trong playlist → nhảy tới bài đó
      set({ currentTrackIndex: index, track });
    } else {
      // ❌ chưa có trong playlist → reset playlist
      set({ track, playlist: [], currentTrackIndex: -1 });
    }
  },
  clearTrack: () => set(initialValues),
  setPlaylist: (playlist: Song[], startIndex = 0) => {
    if (playlist.length === 0) return;

    const validIndex = Math.min(startIndex, playlist.length - 1);
    set({
      playlist,
      currentTrackIndex: validIndex,
      track: playlist[validIndex],
    });
  },
  addToPlaylist: (track: Song) => {
    const { playlist, currentTrackIndex, track: currentTrack } = get();

    if (!track?.id) return;

    // TH1: Playlist rỗng và chưa có bài nào đang phát → khởi tạo luôn
    if (playlist.length === 0 && !currentTrack) {
      set({
        playlist: [track],
        track,
        currentTrackIndex: 0,
      });
      return;
    }

    // TH2: Playlist rỗng nhưng có bài đang phát → thêm sau
    if (playlist.length === 0 && currentTrack) {
      set({
        playlist: [currentTrack, track],
        currentTrackIndex: 0,
      });
      return;
    }

    // TH3: Playlist đã có
    const newPlaylist = [...playlist];
    const newCurrentIndex = currentTrackIndex;

    const existingIndex = newPlaylist.findIndex((s) => s.id === track.id);
    if (existingIndex !== -1) {
      // Đã tồn tại thì không thêm nữa
      return;
    }

    // Thêm vào cuối playlist
    newPlaylist.push(track);

    set({
      playlist: newPlaylist,
      currentTrackIndex: newCurrentIndex,
    });
  },
  playNext: (track: Song) => {
    const { playlist, currentTrackIndex, track: currentTrack } = get();

    // Trường hợp 1: Không có playlist nhưng có track đang phát
    if (playlist.length === 0 && currentTrack) {
      // Playlist mới gồm track hiện tại và track muốn playNext
      set({
        playlist: [currentTrack, track],
        currentTrackIndex: 0,
      });
      return;
    }

    // Trường hợp 2: Không có playlist và không có track → khởi tạo luôn
    if (playlist.length === 0 && !currentTrack) {
      set({
        playlist: [track],
        track,
        currentTrackIndex: 0,
      });
      return;
    }

    // Trường hợp 3: Playlist đã có
    const newPlaylist = [...playlist];
    let newCurrentIndex = currentTrackIndex;

    // Nếu track đã tồn tại trong playlist → xóa trước
    const existingIndex = newPlaylist.findIndex((s) => s.id === track.id);
    if (existingIndex !== -1) {
      newPlaylist.splice(existingIndex, 1);

      // Nếu bài bị xóa nằm trước hoặc tại currentTrackIndex → điều chỉnh lại index
      if (existingIndex <= currentTrackIndex) {
        newCurrentIndex -= 1;
      }
    }

    // Chèn vào sau currentTrackIndex (đã cập nhật)
    const insertIndex = newCurrentIndex + 1;
    newPlaylist.splice(insertIndex, 0, track);

    set({
      playlist: newPlaylist,
      currentTrackIndex: newCurrentIndex,
    });
  },
  nextTrack: (specificIndex?: number) => {
    const { playlist, currentTrackIndex, repeatMode } = get();

    if (!playlist || playlist.length === 0) return;

    let nextIndex;
    if (specificIndex !== undefined) {
      nextIndex = specificIndex;
    } else {
      nextIndex = currentTrackIndex + 1;
      // If we're at the end and repeat all is on, go back to the beginning
      if (nextIndex >= playlist.length) {
        if (repeatMode === 'all') {
          nextIndex = 0;
        } else {
          return; // End of playlist with no repeat
        }
      }
    }

    set({
      currentTrackIndex: nextIndex,
      track: playlist[nextIndex],
    });
  },
  previousTrack: () => {
    const { playlist, currentTrackIndex } = get();

    if (!playlist || playlist.length === 0) return;

    let prevIndex = currentTrackIndex - 1;
    // If we're at the beginning, go to the end
    if (prevIndex < 0) {
      prevIndex = playlist.length - 1;
    }

    set({
      currentTrackIndex: prevIndex,
      track: playlist[prevIndex],
    });
  },
  addToRecentTracks: (track: Song) => {
    set((state) => {
      const updatedRecentTracks = addTrackToRecent(state.recentTracks, track);
      return { recentTracks: state.recentTracks };
      // return { recentTracks: updatedRecentTracks };
    });
  },
  clearRecentTracks: () => {
    localStorage.removeItem('recentTracks');
    set({ recentTracks: [] });
  },
  setIsLoading: (isLoading: boolean) => set({ isLoading }),
  setIsPlaying: (isPlaying: boolean) => set({ isPlaying }),
  setVolume: (volume: number) => set({ volume }),
  setIsShuffle: (isShuffle: boolean) => set({ isShuffle }),
  setRepeatMode: (repeatMode: 'off' | 'all' | 'one') => set({ repeatMode }),
  setOpenPlayList: (openPlayList: boolean) => set({ openPlayList }),
  setFilters: (filters: Omit<SongFilter, 'page' | 'limit'>) => set({ filters }),
  setAudioElement: (element) => set({ audioElement: element }),

  playAudio: () => {
    const audio = get().audioElement;
    if (audio) {
      audio.play().catch(console.error);
      set({ isPlaying: true });
    }
  },

  pauseAudio: () => {
    const audio = get().audioElement;
    if (audio) {
      audio.pause();
      set({ isPlaying: false });
    }
  },
}));
