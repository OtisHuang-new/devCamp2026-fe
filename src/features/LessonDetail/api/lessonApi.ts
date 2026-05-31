import axiosClient from '../../../shared/api/axiosClient';
import type { LessonDataAPI } from '../types/lessonTypes';

export const lessonApi = {
  getLessonById: async (id: string): Promise<LessonDataAPI> => {
    // Ép kiểu (any) và KHÔNG gọi .data nữa vì axiosClient đã bóc tách sẵn rồi
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await axiosClient.get(`/lesson/${id}`);
    return response;
  },
};
