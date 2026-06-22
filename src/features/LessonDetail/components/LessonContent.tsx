// Vị trí: src/features/LessonDetail/components/LessonContent.tsx
import type { LessonDataAPI } from '../types/lessonTypes';
// 1. Import từ Shared
import { ContextualizeMessage } from '../../../shared/components/ContextualizeMessage';
import { MarkdownRender } from '../../../shared/components/MarkdownRender';

interface LessonContentProps {
  data: LessonDataAPI;
}

export default function LessonContent({ data }: LessonContentProps) {
  return (
    <div className="w-full animate-fadeIn">
      <h1 className="text-4xl font-bold text-[#1E3A8A] border-gray-200 pb-8">
        Lesson {data.order}: {data.title}
      </h1>

      {/* 2. Cập nhật Props (Đổi lessonId thành itemId và thêm type) */}
      <ContextualizeMessage itemId={data._id} type="lesson" />

      <MarkdownRender content={data.content} />
    </div>
  );
}
