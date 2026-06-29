import type { ExerciseDataAPI } from '@/features/Exercise/types/exerciseTypes';
import { MarkdownRender } from '../../../shared/components/MarkdownRender'; // Đường dẫn giống hệt bên LessonContent
import { ShowAnswerButton } from '@/shared/components/Buttons/ShowAnswerButton';

interface ExerciseContentProps {
  data: ExerciseDataAPI;
}

export function ExerciseContent({ data }: ExerciseContentProps) {
  // Tái sử dụng lại logic bảng màu từ ExerciseListRow
  const difficultyColors: Record<ExerciseDataAPI['difficulty'], string> = {
    Easy: 'text-green-500',
    Medium: 'text-orange-500',
    Hard: 'text-red-500',
  };

  return (
    <div className="w-full animate-fadeIn">
      {/* 2. SENIOR FIX: Bọc flex justify-between để dạt nút sang phải */}
      <div className="flex justify-between items-center border-gray-200 pb-8 w-full">
        {/* Nhóm Tiêu đề & Độ khó dồn về bên trái */}
        <div className="flex items-center gap-4">
          <h1 className="text-4xl font-bold text-[#1E3A8A]">
            {data.is_project ? 'Project' : 'Exercise'}: {data.title}
          </h1>
          <span
            className={`text-sm font-semibold px-3 py-1 rounded-full bg-gray-100 ${difficultyColors[data.difficulty]}`}
          >
            {data.difficulty}
          </span>
        </div>

        {/* 3. Nút Answer nằm bên phải */}
        {data.key_code && <ShowAnswerButton keyCode={data.key_code} toastPosition="bottom-left" />}
      </div>

      {/* KHỐI NỘI DUNG (MARKDOWN) */}
      <MarkdownRender content={data.content} />
    </div>
  );
}
