import axiosClient from '../../../shared/api/axiosClient';
import type { LessonDataAPI } from '../types/lessonTypes';

export const lessonApi = {
  getLessonById: async (id: string): Promise<LessonDataAPI> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await axiosClient.get(`/lessons/${id}`);
    return response;
  },

  contextualizeLesson: async (lessonId: string, userId: string): Promise<string> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await axiosClient.post(`/lessons/${lessonId}/contextualize`, {
      user_id: userId,
    });

    return typeof response === 'string' ? response : response.context;
  },
};
