import { useSearchParams } from 'react-router-dom';
import { TopicFilter } from './components/TopicFilter';
import { SearchBar } from './components/SearchBar';
import { ExerciseListRow } from './components/ExerciseListRow';
import { useExerciseList } from './hooks/useExerciseList';
import { useAuthContext_v2 } from '@/shared/context/hooks/useAuthContext_v2';
import { Return } from '@/shared/components/Return';

const TOPICS = ['All', 'Array', 'String', 'Math', 'Sorting'];

export function ExerciseList() {
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

    // 1. SENIOR FIX: Bật replace để không lưu filter vào History Stack
    setSearchParams(newParams, { replace: true });
  };

  const handleTitleChange = (newTitle: string) => {
    const newParams = new URLSearchParams(searchParams);

    if (newTitle === '') {
      newParams.delete('title');
    } else {
      newParams.set('title', newTitle);
    }

    // 2. SENIOR FIX: Tương tự cho thanh Search
    setSearchParams(newParams, { replace: true });
  };

  const { exercises, isLoading } = useExerciseList(activeTopic, activeTitle, user?._id);

  if (isLoading) return <div>Đang tải dữ liệu...</div>;

  return (
    <div className="w-full pt-4 font-sans max-w-5xl">
      <Return text="Return to progress" />

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
            No data found in Database.
          </div>
        )}
      </div>
    </div>
  );
}
