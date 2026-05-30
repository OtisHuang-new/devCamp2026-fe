// Vị trí: src/features/Exercise/types/submitTypes.ts

export interface SubmitPayload {
  exerciseId: string;
  userId: string;
  src_code: string;
  language?: string;
  lessonId: string;
}

export interface SubmitTestCaseResult {
  output: string;
  status: 'passed' | 'failed' | string;
}

export interface SubmitResponse {
  _id: string;
  exerciseId: string;
  lessonId: string;
  userId: string;
  results: SubmitTestCaseResult[];
  passedCount: number;
  total: number;
}
