export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Status = 'accepted' | 'failed' | 'none';

export interface ExerciseListItem {
  _id: string;
  title: string;
  topic: string;
  status: Status;
  difficulty: Difficulty;
  index: number; // 1. SENIOR FIX: Bổ sung trường index
}

export interface ParamExerciseListItem {
  topic?: string;
  title?: string;
  user_id: string | undefined;
}

export interface ExerciseListResponse {
  topics: string[];
  exerciseList: ExerciseListItem[];
}
