// Vị trí: src/features/Exercise/api/runApi.ts
import axiosClient from '../../../shared/api/axiosClient';

export interface RunPayload {
  src_code: string;
  language?: string;
  // 1. Đổi input thành mảng inputs
  inputs: string[];
}

// 2. Khai báo cấu trúc phần tử trả về từ API Batch
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
  // 3. Đổi kiểu trả về thành mảng Promise<RunResultItem[]>
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
