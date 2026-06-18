import { create } from 'zustand';

export interface EditorTestCase {
  input: string;
  expected_output: string;
}

interface EditorStore {
  initialCode: string;
  setInitialCode: (code: string) => void;
  publicTestCases: EditorTestCase[];
  setPublicTestCases: (cases: EditorTestCase[]) => void;
}

export const useEditorStore = create<EditorStore>((set) => ({
  initialCode: '# Bro, you can write you code here :like :) ',
  setInitialCode: (code) => set({ initialCode: code }),

  publicTestCases: [],
  setPublicTestCases: (cases) => set({ publicTestCases: cases }),
}));
