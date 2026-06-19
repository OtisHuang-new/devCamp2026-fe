// Vị trí: src/shared/store/useAIChatStore.ts
import { create } from 'zustand';

interface AIChatStore {
  isChatMounted: boolean;
  isAILoading: boolean;
  externalQuery: string | null;
  setChatMounted: (status: boolean) => void;
  setAILoading: (status: boolean) => void;
  setExternalQuery: (query: string | null) => void;
}

export const useAIChatStore = create<AIChatStore>((set) => ({
  isChatMounted: false,
  isAILoading: false,
  externalQuery: null,
  setChatMounted: (status) => set({ isChatMounted: status }),
  setAILoading: (status) => set({ isAILoading: status }),
  setExternalQuery: (query) => set({ externalQuery: query }),
}));
