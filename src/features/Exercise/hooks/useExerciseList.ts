// Vị trí: src/features/Exercise/hooks/useExerciseList.ts
import { useEffect, useState } from 'react';
import { exerciseApi } from '../api/exerciseApi';
import type { ExerciseListItem, ParamExerciseListItem } from '../types/exerciseListTypes';

export function useExerciseList(topic: string, title: string, user_id: string | undefined) {
  const [exercises, setExercises] = useState<ExerciseListItem[]>([]);
  // 4. SENIOR FIX: Thêm state quản lý mảng topics từ API
  const [topics, setTopics] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user_id) return;

    const controller = new AbortController();

    async function fetchData() {
      setIsLoading(true);

      try {
        const params: ParamExerciseListItem = { user_id };

        if (topic !== 'All') params.topic = topic;
        if (title !== '') params.title = title;

        const response = await exerciseApi.getExerciseList(params);

        // 5. SENIOR FIX: Bóc tách dữ liệu theo đúng cấu trúc mới, loại bỏ hoàn toàn type 'any'
        if (response && response.exerciseList) {
          setExercises(response.exerciseList);
          setTopics(response.topics || []);
        } else {
          setExercises([]);
          setTopics([]);
        }
      } catch (error) {
        console.log('Lỗi fetch ExerciseList: ', error);
        setExercises([]);
        setTopics([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [topic, title, user_id]);

  // 6. SENIOR FIX: Return thêm topics ra ngoài cho UI sử dụng
  return { exercises, topics, isLoading };
}
