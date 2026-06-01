import axiosClient from '../../../shared/api/axiosClient';
import type { SubmitPayload, SubmitResponse } from '../types/submitTypes';

export const submitApi = {
  submitCode: async (exerciseId: string, payload: SubmitPayload): Promise<SubmitResponse> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await axiosClient.post(`/exercises/${exerciseId}/submissions`, payload);
    return response;
  },
};
