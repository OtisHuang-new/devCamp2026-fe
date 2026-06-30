// Vị trí: src/features/Exercise/api/evaluatorApi.ts
import axiosClient from '../../../shared/api/axiosClient';
import type { EvaluateResponse } from '../types/evaluatorTypes';

export const evaluatorApi = {
  // 1. SENIOR FIX: Xóa tham số payload ở đây
  evaluateSubmission: async (submissionId: string): Promise<EvaluateResponse> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await axiosClient.post(
      `/ai/submissions/${submissionId}/evaluate`,
      {}, // 2. Truyền Empty Object
    );
    return response;
  },
};
