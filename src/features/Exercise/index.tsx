import { useNavigate } from 'react-router-dom';
import { TopicFilter } from './components/TopicFilter';
import { SearchBar } from './components/SearchBar';
import { ExerciseListRow } from './components/ExerciseListRow';
import type { ExerciseListItem } from './types/exerciseListTypes';

// DỮ LIỆU GIẢ (Mock Data) - Chuẩn bị cho API ngày mai
const MOCK_EXERCISES: ExerciseListItem[] = [
  { id: 1, title: 'Contains Duplicate', difficulty: 'Easy', isSolved: false },
  { id: 2, title: 'Add Two Numbers', difficulty: 'Medium', isSolved: true },
  {
    id: 3,
    title: 'Longest Substring Without Reapeating Characters',
    difficulty: 'Easy',
    isSolved: true,
  },
  { id: 4, title: 'Median of Two Sorted Arrays', difficulty: 'Hard', isSolved: false },
  { id: 5, title: 'Longest Palindromic Substring', difficulty: 'Hard', isSolved: false },
  { id: 6, title: 'Zigzag Conversion', difficulty: 'Medium', isSolved: false },
  { id: 7, title: 'Reverse Interger', difficulty: 'Hard', isSolved: true },
  { id: 8, title: 'String to Interger', difficulty: 'Medium', isSolved: false },
];

const TOPICS = ['All topics', 'Array', 'String', 'Math', 'Sorting'];

export function ExerciseList() {
  const navigate = useNavigate();

  return (
    <div className="w-full mx-auto px-8 pt-4 font-sans max-w-5xl">
      {/* HEADER (Sẽ refactor thành Component chung sau) */}
      <div className="flex justify-between items-center mb-[15px] border-b border-gray-800 pb-3">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-900 font-medium transition-colors hover:opacity-70"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            ></path>
          </svg>
          Return to progress
        </button>
      </div>

      {/* VÙNG CHỨA BỘ LỌC (Topic & Search) */}
      <TopicFilter topics={TOPICS} activeTopic="All topics" />
      <SearchBar />

      {/* DANH SÁCH BÀI TẬP */}
      <div className="flex flex-col rounded-xl overflow-hidden">
        {MOCK_EXERCISES.map((exercise) => (
          <ExerciseListRow key={exercise.id} data={exercise} />
        ))}
      </div>
    </div>
  );
}
