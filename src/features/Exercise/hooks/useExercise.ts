import { useState, useEffect } from 'react';
import { exerciseApi } from '../api/exerciseApi';
import type { ExerciseDataAPI } from '../types/exerciseTypes';

export const useExercise = (exerciseId: string | undefined) => {
  const [exercise, setExercise] = useState<ExerciseDataAPI | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(!!exerciseId);

  useEffect(() => {
    if (!exerciseId) {
      return;
    }

    const fetchExercise = async () => {
      setIsLoading(true);
      try {
        const data = await exerciseApi.getExerciseById(exerciseId);
        setExercise(data);
      } catch (error) {
        console.error('Failed to fetch exercise:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExercise();
  }, [exerciseId]);

  return { exercise, isLoading };
};
