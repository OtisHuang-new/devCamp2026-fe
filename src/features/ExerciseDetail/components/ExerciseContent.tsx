import type { ExerciseDataAPI } from '@/features/Exercise/types/exerciseTypes';
import { MarkdownRender } from '../../../shared/components/MarkdownRender'; // Đường dẫn giống hệt bên LessonContent

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
      {/* KHỐI TIÊU ĐỀ & ĐỘ KHÓ */}
      <div className="flex items-center gap-4 border-gray-200 pb-8">
        <h1 className="text-4xl font-bold text-[#1E3A8A]">Exercise: {data.title}</h1>

        {/* Nút badge (nhãn) hiển thị độ khó */}
        <span
          className={`text-sm font-semibold px-3 py-1 rounded-full bg-gray-100 ${difficultyColors[data.difficulty]}`}
        >
          {data.difficulty}
        </span>
      </div>

      {/* KHỐI NỘI DUNG (MARKDOWN) */}
      <MarkdownRender content={data.content} />
    </div>
  );
}
