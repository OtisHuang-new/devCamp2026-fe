import axiosClient from '../../../shared/api/axiosClient';
import type { ExerciseDataAPI } from '../types/exerciseTypes';

export const exerciseApi = {
  getExerciseById: async (id: string): Promise<ExerciseDataAPI> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await axiosClient.get(`/exercises/${id}`);

    // Vì JSON API trả về có dạng { "status": "success", "data": { ... } }
    // nên ta cần chọc vào .data để lấy đúng thông tin bài tập
    return response.data;
  },
};
