import { useEffect } from 'react';
import { useEditorStore } from '../../../shared/store/useEditorStore';
import type { ExerciseDataAPI } from '../types/exerciseTypes';

export function useSyncEditorStore(exercise: ExerciseDataAPI | null | undefined) {
  const setInitialCode = useEditorStore((state) => state.setInitialCode);
  const setPublicTestCases = useEditorStore((state) => state.setPublicTestCases);

  useEffect(() => {
    if (exercise) {
      if (exercise.initial_code) {
        setInitialCode(exercise.initial_code);
      }

      // Chỉ lấy những test case không bị ẩn
      const visibleCases = exercise.test_cases.filter((tc) => !tc.is_hidden);
      setPublicTestCases(visibleCases);
    }
  }, [exercise, setInitialCode, setPublicTestCases]);
}
