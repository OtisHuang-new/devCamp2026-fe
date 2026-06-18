import { useNavigate, useSearchParams } from 'react-router-dom';
import { TopicFilter } from './components/TopicFilter';
import { SearchBar } from './components/SearchBar';
import { ExerciseListRow } from './components/ExerciseListRow';
import { useExerciseList } from './hooks/useExerciseList';
import { useAuthContext_v2 } from '@/shared/context/hooks/useAuthContext_v2';

const TOPICS = ['All', 'Array', 'String', 'Math', 'Sorting'];

export function ExerciseList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuthContext_v2();

  const activeTopic = searchParams.get('topic') || 'All';
  const activeTitle = searchParams.get('title') || '';

  const handleTopicChange = (newTopic: string) => {
    const newParams = new URLSearchParams(searchParams);

    if (newTopic === 'All') {
      newParams.delete('topic');
    } else {
      newParams.set('topic', newTopic);
    }

    setSearchParams(newParams);
  };

  const handleTitleChange = (newTitle: string) => {
    const newParams = new URLSearchParams(searchParams);

    if (newTitle === '') {
      newParams.delete('title');
    } else {
      newParams.set('title', newTitle);
    }

    setSearchParams(newParams);
  };

  const { exercises, isLoading } = useExerciseList(activeTopic, activeTitle, user?._id);

  if (isLoading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="w-full pt-4 font-sans max-w-5xl">
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
      <TopicFilter topics={TOPICS} activeTopic={activeTopic} onTopicChange={handleTopicChange} />

      <SearchBar activeTitle={activeTitle} onTitleChange={handleTitleChange} />

      {/* DANH SÁCH BÀI TẬP */}
      <div className="flex flex-col rounded-xl overflow-hidden">
        {/* SENIOR FIX: Code phòng thủ. Chỉ map khi nó chắc chắn là 1 Array */}
        {Array.isArray(exercises) && exercises.length > 0 ? (
          exercises.map((exercise) => <ExerciseListRow key={exercise._id} data={exercise} />)
        ) : (
          <div className="text-center py-10 text-gray-500 font-medium">
            Không có bài tập nào hoặc dữ liệu bị lỗi.
          </div>
        )}
      </div>
    </div>
  );
}
