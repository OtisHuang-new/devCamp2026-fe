// Vị trí: src/features/Exercise/api/runApi.ts
import axiosClient from '../../../shared/api/axiosClient';

export interface RunPayload {
  src_code: string;
  language?: string;
  input: string;
}

export interface RunResponse {
  output: string | null;
  error: string | null;
}

export const runApi = {
  runCode: async (exerciseId: string, payload: RunPayload): Promise<RunResponse> => {
    const requestData = {
      src_code: payload.src_code,
      language: payload.language || 'python', // Mặc định là python
      input: payload.input,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await axiosClient.post(`/exercises/${exerciseId}/run`, requestData);
    return response;
  },
};
