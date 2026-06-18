import axiosClient from '../../../shared/api/axiosClient';

export interface RunPayload {
  src_code: string;
  language?: string;
  inputs: string[];
}

export interface RunResultItem {
  output: string;
  error: string;
  status: string;
  exit_code: number;
  signal: string | null;
  time: string;
  memory: string;
  total: string;
}

export const runApi = {
  runCode: async (exerciseId: string, payload: RunPayload): Promise<RunResultItem[]> => {
    const requestData = {
      src_code: payload.src_code,
      language: payload.language || 'python-3.14', // Default mới
      inputs: payload.inputs,
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const response: any = await axiosClient.post(`/exercises/${exerciseId}/run`, requestData);
    return response;
  },
};
