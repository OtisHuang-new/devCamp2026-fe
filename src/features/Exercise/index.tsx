import { useNavigate, useSearchParams } from 'react-router-dom';
import { TopicFilter } from './components/TopicFilter';
import { SearchBar } from './components/SearchBar';
import { ExerciseListRow } from './components/ExerciseListRow';
import { useExerciseList } from './hooks/useExerciseList';

const TOPICS = ['All', 'Array', 'String', 'Math', 'Sorting'];

export function ExerciseList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

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

  const { exercises, isLoading } = useExerciseList(activeTopic, activeTitle);

  if (isLoading) return <div>Đang tải dữ liệu...</div>;

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
      <TopicFilter
        topics={TOPICS} //để tạm fix sau
        activeTopic={activeTopic}
        onTopicChange={handleTopicChange}
      />

      <SearchBar activeTitle={activeTitle} onTitleChange={handleTitleChange} />

      {/* DANH SÁCH BÀI TẬP */}
      <div className="flex flex-col rounded-xl overflow-hidden">
        {exercises.map(
          (
            exercise, // để tạm fix sau
          ) => (
            <ExerciseListRow key={exercise._id} data={exercise} />
          ),
        )}
      </div>
    </div>
  );
}
