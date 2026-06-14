import type { ExerciseDataAPI } from '@/features/Exercise/types/exerciseTypes';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { exerciseApi } from '@/features/Exercise/api/exerciseApi';

export function useExerciseDetail() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [exerciseDetail, setexerciseDetail] = useState<ExerciseDataAPI | null>(null);
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!id) return;

    const controller = new AbortController();

    async function fetchData() {
      setIsLoading(true);
      try {
        const data = await exerciseApi.getExerciseById(id!); // check
        setexerciseDetail(data);
      } catch (error) {
        console.log('useExerciseDetail bị error nè bro', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
    return () => {
      controller.abort();
    };
  }, [id]);

  return { exerciseDetail, isLoading };
}
