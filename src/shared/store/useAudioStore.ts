import { create } from 'zustand';

interface AudioState {
  isPlaying: boolean;
  togglePlay: () => void;
  setPlay: (status: boolean) => void;
}

export const useAudioStore = create<AudioState>((set) => ({
  // Mặc định phải là false vì policy của trình duyệt không cho tự phát nhạc
  isPlaying: false,
  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  setPlay: (status) => set({ isPlaying: status }),
}));
