// Vị trí: src/features/Exercise/types/submitTypes.ts

export interface SubmitPayload {
  exercise_id: string;
  language?: string;
  lesson_id: string;
  src_code: string;
  user_id: string;
}

export interface SubmitTestCaseResult {
  output: string;
  status: 'passed' | 'failed' | string;
}

export interface SubmitResponse {
  _id: string;
  exercise_id: string;
  lesson_id: string;
  user_id: string;
  results: SubmitTestCaseResult[];
  passedCount: number;
  total: number;
}
