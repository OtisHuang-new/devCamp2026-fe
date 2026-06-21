// Vị trí: src/features/Exercise/hooks/useExercise.ts
import { useState, useEffect } from 'react';
import { exerciseApi } from '../api/exerciseApi';
import type { ExerciseDataAPI } from '../types/exerciseTypes';
// 1. SENIOR FIX: Import context
import { useAuthContext_v2 } from '../../../shared/context/hooks/useAuthContext_v2';

export const useExercise = (exerciseId: string | undefined) => {
  const [exercise, setExercise] = useState<ExerciseDataAPI | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!!exerciseId);

  // 2. SENIOR FIX: Lấy primitive userId
  const { user } = useAuthContext_v2();
  const userId = user?._id;

  useEffect(() => {
    // 3. SENIOR FIX: Chặn thực thi nếu thiếu exerciseId hoặc userId
    if (!exerciseId || !userId) {
      return;
    }

    const fetchExercise = async () => {
      setIsLoading(true);
      try {
        // 4. SENIOR FIX: Truyền userId xuống API
        const data = await exerciseApi.getExerciseById(exerciseId, userId);
        setExercise(data);
      } catch (error) {
        console.error('Failed to fetch exercise:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercise();
    // 5. SENIOR FIX: Khai báo userId vào dependency array
  }, [exerciseId, userId]);

  return { exercise, isLoading };
};
