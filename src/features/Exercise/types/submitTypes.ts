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
  status: string; // 'passed' | 'failed'
  error?: string; // MỚI: Backend sẽ trả về error nếu bị lỗi biên dịch
}

export interface PostSubmitResponse {
  _id: string;
  exerciseId: string;
  lessonId: string;
  userId: string;
  results: SubmitTestCaseResult[];
  status: string;
}

// --- 2. DÀNH CHO API GET (LỊCH SỬ NỘP BÀI) ---
export interface AIEvaluation {
  first_res: string;
  second_res: string;
}

export interface SubmissionHistoryItem {
  _id: string;
  src_code: string;
  results: SubmitTestCaseResult[];
  status: string; // 'accepted' | 'failed_public' | 'failed_hidden'
  AI_evaluation?: AIEvaluation; // Optional vì có thể AI chưa kịp chấm xong
  createdAt: string;
}
