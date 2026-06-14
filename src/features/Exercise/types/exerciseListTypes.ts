export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Status = 'accepted' | 'failed' | 'none';

export interface ExerciseListItem {
  _id: string;
  title: string;
  topic: string;
  status: Status;
  difficulty: Difficulty;
}

export interface ParamExerciseListItem {
  topic?: string;
  title?: string;
}
