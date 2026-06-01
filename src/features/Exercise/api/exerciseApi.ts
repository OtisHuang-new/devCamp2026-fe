import axiosClient from '../../../shared/api/axiosClient';
import type { ExerciseDataAPI } from '../types/exerciseTypes';

export const exerciseApi = {
  getExerciseById: async (id: string): Promise<ExerciseDataAPI> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await axiosClient.get(`/exercises/${id}`);

    return response.data;
  },
};
