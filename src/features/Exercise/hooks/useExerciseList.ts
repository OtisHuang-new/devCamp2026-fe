// Vị trí: src/features/Exercise/hooks/useExerciseList.ts

import { useEffect, useState } from 'react';
import { exerciseApi } from '../api/exerciseApi';
import type { ExerciseListItem, ParamExerciseListItem } from '../types/exerciseListTypes';

export function useExerciseList(topic: string, title: string, user_id: string | undefined) {
  const [exercises, setExercises] = useState<ExerciseListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user_id) {
      return;
    }
    const controller = new AbortController();

    async function fetchData() {
      setIsLoading(true);

      try {
        const params: ParamExerciseListItem = { user_id };

        if (topic !== 'All') params.topic = topic;
        if (title !== '') params.title = title;

        const response = await exerciseApi.getExerciseList(params);

        // SENIOR DEBUG: In ra Console để xem Backend thực sự trả về cấu trúc gì
        console.log('Dữ liệu gốc từ API GET /exercises:', response);

        // BỘ BÓC TÁCH THÔNG MINH
        if (Array.isArray(response)) {
          // Trường hợp 1: Backend trả thẳng về Mảng (Chuẩn)
          setExercises(response);
        } else if (response && typeof response === 'object') {
          // Trường hợp 2: Backend bọc trong Object (Ví dụ: { data: [...] } hoặc { metadata: ..., exercises: [...] })
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const resObj = response as any;

          // Tự động tìm mảng ở các key phổ biến mà Backend hay dùng
          const actualArray = resObj.data || resObj.exercises || resObj.items || [];
          setExercises(actualArray);
        } else {
          setExercises([]);
        }
      } catch (error) {
        console.log('thông điệp từ useExerciseList hehe: ', error);
        setExercises([]); // Đảm bảo lỗi thì state vẫn là 1 mảng rỗng
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [topic, title, user_id]);

  return { exercises, isLoading };
}
