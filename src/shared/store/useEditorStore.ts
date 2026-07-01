// Vị trí: src/shared/store/useEditorStore.ts
import { create } from 'zustand';

export interface EditorTestCase {
  input: string;
  expected_output: string;
}

interface EditorStore {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  toggleOpen: () => void;

  initialCode: string;
  setInitialCode: (code: string) => void;

  // 1. SENIOR FIX: Bổ sung keyCode vào Store
  keyCode?: string;
  setKeyCode: (code?: string) => void;

  publicTestCases: EditorTestCase[];
  setPublicTestCases: (cases: EditorTestCase[]) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  // --- 2. MỚI: Khởi tạo state ---
  isOpen: false,
  setIsOpen: (isOpen) => set({ isOpen }),
  toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),

  keyCode: undefined,
  setKeyCode: (code) => set({ keyCode: code }),

  initialCode: '# Bro, you can write you code here :like :) ',
  setInitialCode: (code) => set({ initialCode: code }),

  publicTestCases: [],
  setPublicTestCases: (cases) => set({ publicTestCases: cases }),
}));
