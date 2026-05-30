import { useState, useEffect } from 'react';
import { exerciseApi } from '../api/exerciseApi';
import type { ExerciseDataAPI } from '../types/exerciseTypes';

export const useExercise = (exerciseId: string | undefined) => {
  const [exercise, setExercise] = useState<ExerciseDataAPI | null>(null);

  // 1. THAY ĐỔI TẠI ĐÂY: Khởi tạo thông minh
  // Dấu !! ép kiểu sang boolean.
  // Nếu có exerciseId -> isLoading = true. Nếu không có -> isLoading = false.
  const [isLoading, setIsLoading] = useState<boolean>(!!exerciseId);

  useEffect(() => {
    // 2. THAY ĐỔI TẠI ĐÂY: Xóa lệnh setIsLoading(false), chỉ cần return là đủ.
    if (!exerciseId) {
      return;
    }

    const fetchExercise = async () => {
      setIsLoading(true); // Đảm bảo bật loading khi bắt đầu gọi API
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
