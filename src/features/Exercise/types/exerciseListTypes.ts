// Định nghĩa tường minh các cấp độ để tránh gõ sai chính tả
export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface ExerciseListItem {
  id: number;
  title: string;
  difficulty: Difficulty;
  isSolved: boolean;
}
