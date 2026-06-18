import axiosClient from '../../../shared/api/axiosClient';
import type { ExerciseListItem, ParamExerciseListItem } from '../types/exerciseListTypes';
import type { ExerciseDataAPI } from '../types/exerciseTypes';

export const exerciseApi = {
  async getExerciseById(id: string): Promise<ExerciseDataAPI> {
    const response = await axiosClient.get<ExerciseDataAPI, ExerciseDataAPI>(`/exercises/${id}`);
    return response;
  },

  async getExerciseList(params: ParamExerciseListItem): Promise<ExerciseListItem[]> {
    const response = await axiosClient.get<ExerciseListItem[], ExerciseListItem[]>(`/exercises`, {
      params: params,
    });
    return response;
  },
};
