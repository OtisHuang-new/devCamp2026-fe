import type { ExerciseDataAPI } from '@/features/Exercise/types/exerciseTypes';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { exerciseApi } from '@/features/Exercise/api/exerciseApi';
import { useAuthContext_v2 } from '@/shared/context/hooks/useAuthContext_v2';

export function useExerciseDetail() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [exerciseDetail, setexerciseDetail] = useState<ExerciseDataAPI | null>(null);
  const { id } = useParams<{ id: string }>();

  const { user } = useAuthContext_v2();
  const userId = user?._id;

  useEffect(() => {
    // 3. SENIOR FIX: Chặn thực thi nếu không có id hoặc userId
    if (!id || !userId) return;

    const controller = new AbortController();

    async function fetchData() {
      setIsLoading(true);
      try {
        // 4. SENIOR FIX: Truyền userId xuống API
        const data = await exerciseApi.getExerciseById(id!, userId!);
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
    // 5. SENIOR FIX: Khai báo userId vào dependency array
  }, [id, userId]);

  return { exerciseDetail, isLoading };
}
