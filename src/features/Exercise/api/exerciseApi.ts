import axiosClient from '../../../shared/api/axiosClient';
import type { ParamExerciseListItem, ExerciseListResponse } from '../types/exerciseListTypes';
import type { ExerciseDataAPI } from '../types/exerciseTypes';

export const exerciseApi = {
  // 1. SENIOR FIX: Thêm tham số userId và truyền vào params
  async getExerciseById(id: string, userId: string): Promise<ExerciseDataAPI> {
    const response = await axiosClient.get<ExerciseDataAPI, ExerciseDataAPI>(`/exercises/${id}`, {
      params: { user_id: userId },
    });
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
};
