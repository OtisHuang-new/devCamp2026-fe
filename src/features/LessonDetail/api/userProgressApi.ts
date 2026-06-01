import axiosClient from '../../../shared/api/axiosClient';

export const userProgressApi = {
  updateLessonProgress: async (userId: string) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await axiosClient.patch('/auth/update-lesson', {
      userId: userId,
    });
    return response;
  },
};
