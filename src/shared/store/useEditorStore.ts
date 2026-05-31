import { create } from 'zustand';

// --- 1. THÊM INTERFACE CHO TEST CASE ---
export interface EditorTestCase {
  input: string;
  expected_output: string;
}
// ---------------------------------------

interface EditorStore {
  initialCode: string;
  setInitialCode: (code: string) => void;
  // --- 2. BỔ SUNG BIẾN VÀ HÀM CHO TEST CASE ---
  publicTestCases: EditorTestCase[];
  setPublicTestCases: (cases: EditorTestCase[]) => void;
  // --------------------------------------------
}

export const useEditorStore = create<EditorStore>((set) => ({
  initialCode: '# Bro, you can write you code here :like :) ',
  setInitialCode: (code) => set({ initialCode: code }),

  // --- 3. KHỞI TẠO GIÁ TRỊ MẶC ĐỊNH ---
  publicTestCases: [],
  setPublicTestCases: (cases) => set({ publicTestCases: cases }),
  // -----------------------------------
}));
