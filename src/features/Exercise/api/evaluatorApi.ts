// Vị trí: src/features/Exercise/api/evaluatorApi.ts
import axiosClient from '../../../shared/api/axiosClient';
import type { EvaluatePayload, EvaluateResponse } from '../types/evaluatorTypes';

export const evaluatorApi = {
  evaluateSubmission: async (
    submissionId: string,
    payload: EvaluatePayload,
  ): Promise<EvaluateResponse> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await axiosClient.post(
      `/ai/submissions/${submissionId}/evaluate`,
      payload,
    );
    return response;
  },
};
