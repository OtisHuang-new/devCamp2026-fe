import axiosClient from '../../../shared/api/axiosClient';
import type { LessonDataAPI } from '../types/lessonTypes';

export const lessonApi = {
  getLessonById: async (id: string): Promise<LessonDataAPI> => {
    // Ép kiểu (any) và KHÔNG gọi .data nữa vì axiosClient đã bóc tách sẵn rồi
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await axiosClient.get(`/lesson/${id}`);
    return response;
  },

  contextualizeLesson: async (lessonId: string, userId: string): Promise<string> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await axiosClient.post(`/lesson/${lessonId}/contextualize`, {
      user_id: userId,
    });

    // Xử lý an toàn: Nếu là chuỗi thì lấy luôn, nếu là Object thì lấy trường context
    return typeof response === 'string' ? response : response.context;
  },
};
