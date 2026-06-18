// Vị trí: src/shared/store/useRightbarStore.ts
import { create } from 'zustand';
import type { ReactNode } from 'react';

interface RightbarState {
  content: ReactNode | null;
  setContent: (content: ReactNode | null) => void;
}

export const useRightbarStore = create<RightbarState>((set) => ({
  content: null,
  setContent: (content) => set({ content }),
}));
