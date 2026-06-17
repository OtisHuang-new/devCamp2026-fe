// Vị trí: src/features/Exercise/api/submitApi.ts

import axiosClient from '../../../shared/api/axiosClient';
import type {
  SubmitPayload,
  PostSubmitResponse,
  SubmissionHistoryItem,
} from '../types/submitTypes';

export const submitApi = {
  // 1. API Gửi code chấm điểm
  submitCode: async (exerciseId: string, payload: SubmitPayload): Promise<PostSubmitResponse> => {
    const response = await axiosClient.post<PostSubmitResponse, PostSubmitResponse>(
      `/exercises/${exerciseId}/submissions`,
      payload,
    );
    return response;
  },

  // 2. API Lấy lịch sử 5 lần nộp gần nhất
  getSubmissionHistory: async (
    exerciseId: string,
    userId: string,
  ): Promise<SubmissionHistoryItem[]> => {
    const response = await axiosClient.get<SubmissionHistoryItem[], SubmissionHistoryItem[]>(
      `/exercises/${exerciseId}/submissions`,
      {
        params: { user_id: userId }, // TRUYỀN QUERY PARAM VÀO ĐÂY
      },
    );
    return response;
  },
};
