// Vị trí: src/features/Exercise/types/evaluatorTypes.ts

export interface EvaluateScore {
  syntax: number;
  logic: number;
  optimization: number;
}

export interface AIEvaluation {
  first_res: string;
  second_res: string;
}

export interface EvaluateResponse {
  _id: string;
  exerciseId: string;
  src_code: string;
  status: string;
  content: string;
  score: EvaluateScore;
  AI_evaluation: AIEvaluation;
  updatedAt: string;
}
