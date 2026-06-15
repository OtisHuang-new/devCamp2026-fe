// Vị trí: src/features/Exercise/types/submitTypes.ts

// --- 1. DÀNH CHO API POST (NỘP BÀI) ---

export interface SubmitPayload {
  exercise_id: string;
  user_id: string;
  lesson_id: string;
  src_code: string;
  language?: string;
}

export interface SubmitTestCaseResult {
  output: string;
  status: 'passed' | 'failed' | string;
  error?: string; // MỚI: Backend sẽ trả về error nếu bị lỗi biên dịch
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

// --- 2. DÀNH CHO API GET (LỊCH SỬ NỘP BÀI) ---

export interface AIEvaluation {
  first_res: string;
  second_res: string;
}

export interface SubmissionHistoryItem {
  _id: string;
  src_code: string;
  AI_evaluation: AIEvaluation;
  createdAt: string;
  updatedAt: string;
}
