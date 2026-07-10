// Vị trí: src/features/Exercise/hooks/useSyncEditorStore.ts
import { useEffect } from 'react';
import { useEditorStore } from '../../../shared/store/useEditorStore';
import type { ExerciseDataAPI } from '../types/exerciseTypes';

export function useSyncEditorStore(exercise: ExerciseDataAPI | null | undefined) {
  const setInitialCode = useEditorStore((state) => state.setInitialCode);
  const setOriginalCode = useEditorStore((state) => state.setOriginalCode);
  const setPublicTestCases = useEditorStore((state) => state.setPublicTestCases);
  const setKeyCode = useEditorStore((state) => state.setKeyCode); // 1. Lấy hàm từ store
  const setCurrentCode = useEditorStore((state) => state.setCurrentCode);

  useEffect(() => {
    if (exercise) {
      if (exercise.initial_code) {
        setInitialCode(exercise.initial_code);
        setOriginalCode(exercise.initial_code);

        // 4. SENIOR FIX: Bơm code gốc vào làm vốn ban đầu cho Current Code
        setCurrentCode(exercise.initial_code);
      }

      setKeyCode(exercise.key_code);

      const visibleCases = exercise.test_cases.filter((tc) => !tc.is_hidden);
      setPublicTestCases(visibleCases);
    } else {
      setKeyCode(undefined);
    }
  }, [exercise, setInitialCode, setOriginalCode, setCurrentCode, setPublicTestCases, setKeyCode]);
}
