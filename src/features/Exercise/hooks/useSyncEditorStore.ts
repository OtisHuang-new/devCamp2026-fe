// Vị trí: src/features/Exercise/hooks/useSyncEditorStore.ts
import { useEffect } from 'react';
import { useEditorStore } from '../../../shared/store/useEditorStore';
import type { ExerciseDataAPI } from '../types/exerciseTypes';

export function useSyncEditorStore(exercise: ExerciseDataAPI | null | undefined) {
  const setInitialCode = useEditorStore((state) => state.setInitialCode);
  const setPublicTestCases = useEditorStore((state) => state.setPublicTestCases);
  const setKeyCode = useEditorStore((state) => state.setKeyCode); // 1. Lấy hàm từ store

  useEffect(() => {
    if (exercise) {
      if (exercise.initial_code) {
        setInitialCode(exercise.initial_code);
      }

      // 2. SENIOR FIX: Cập nhật keyCode vào Store
      setKeyCode(exercise.key_code);

      const visibleCases = exercise.test_cases.filter((tc) => !tc.is_hidden);
      setPublicTestCases(visibleCases);
    } else {
      // Dọn dẹp an toàn nếu không có exercise
      setKeyCode(undefined);
    }
  }, [exercise, setInitialCode, setPublicTestCases, setKeyCode]);
}
