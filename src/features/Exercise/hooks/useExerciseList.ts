import { useEffect, useState } from 'react';

import { exerciseApi } from '../api/exerciseApi';
import type { ExerciseListItem, ParamExerciseListItem } from '../types/exerciseListTypes';

export function useExerciseList(topic: string, title: string) {
  const [exercises, setExercises] = useState<ExerciseListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController(); // nếu request 1 đang bay mà react gọi req 2 thì abort (kill) req 1

    async function fetchData() {
      setIsLoading(true);

      try {
        const params: ParamExerciseListItem = {};

        if (topic !== 'All') {
          params.topic = topic; // Chỉ gắn topic nếu nó khác 'All'
        }
        if (title !== '') {
          params.title = title; // Chỉ gắn title nếu user có gõ chữ
        }

        const data = await exerciseApi.getExerciseList(params);
        setExercises(data);
      } catch (error) {
        console.log('thông điệp từ useExerciseList hehe: ', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();

    return () => {
      controller.abort(); // thực thi dọn dẹp
    };
  }, [topic, title]);

  return { exercises, isLoading };
}
