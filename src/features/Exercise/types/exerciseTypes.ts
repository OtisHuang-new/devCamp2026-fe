// 1. Khai báo kiểu cho từng test case
export interface TestCase {
  input: string;
  expected_output: string;
  output?: string;
  is_hidden: boolean;
}

// 2. Khai báo kiểu cho toàn bộ cục data trả về
export interface ExerciseDataAPI {
  _id: string;
  chapter_id: string;
  lesson_id: string;
  title: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  initial_code: string;
  content: string;
  test_cases: TestCase[];
  time_limit: number;
  memory_limit: number;
  is_project: boolean; // 1. SENIOR FIX: Khai báo field mới
  key_code?: string;
}
