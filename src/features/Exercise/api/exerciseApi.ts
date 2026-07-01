import axiosClient from '../../../shared/api/axiosClient';
import type { ParamExerciseListItem, ExerciseListResponse } from '../types/exerciseListTypes';
import type { ExerciseDataAPI } from '../types/exerciseTypes';

export const exerciseApi = {
  // 1. SENIOR FIX: Thêm tham số userId và truyền vào params
  async getExerciseById(id: string, userId: string): Promise<ExerciseDataAPI> {
    const response = await axiosClient.get<ExerciseDataAPI, ExerciseDataAPI>(`/exercises/${id}`, {
      params: { user_id: userId },
    });

    if (response && response.test_cases) {
      response.test_cases = response.test_cases.map((tc) => ({
        ...tc,
        expected_output: tc.expected_output || tc.output || '',
      }));
    }

    return response;
  },

  async getExerciseList(params: ParamExerciseListItem): Promise<ExerciseListResponse> {
    const response = await axiosClient.get<ExerciseListResponse, ExerciseListResponse>(
      `/exercises`,
      {
        params: params,
      },
    );
    return response;
  },

  async contextualizeExercise(exerciseId: string, userId: string): Promise<string> {
    const response = await axiosClient.post<unknown, { context?: string } | string>(
      `/exercises/${exerciseId}/contextualize`,
      { user_id: userId },
    );
    // Xử lý an toàn: Axios có thể trả về string thẳng, hoặc bọc trong object { context }
    return typeof response === 'string' ? response : (response.context ?? '');
  },
};
