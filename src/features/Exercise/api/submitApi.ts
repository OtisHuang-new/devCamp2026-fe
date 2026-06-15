// Vị trí: src/features/Exercise/api/submitApi.ts

import axiosClient from '../../../shared/api/axiosClient';
import type { SubmitPayload, SubmitResponse, SubmissionHistoryItem } from '../types/submitTypes';

export const submitApi = {
  // 1. API Gửi code chấm điểm
  submitCode: async (exerciseId: string, payload: SubmitPayload): Promise<SubmitResponse> => {
    // Dùng Generic Type để ép kiểu trả về chuẩn xác, xóa bỏ "any"
    const response = await axiosClient.post<SubmitResponse, SubmitResponse>(
      `/exercises/${exerciseId}/submissions`,
      payload,
    );
    return response;
  },

  // 2. API Lấy lịch sử 5 lần nộp gần nhất
  getSubmissionHistory: async (exerciseId: string): Promise<SubmissionHistoryItem[]> => {
    const response = await axiosClient.get<SubmissionHistoryItem[], SubmissionHistoryItem[]>(
      `/exercises/${exerciseId}/submissions`,
    );
    return response;
  },
};
