// Vị trí: src/features/LessonDetail/components/LessonContent.tsx
import type { LessonDataAPI } from '../types/lessonTypes';
import { ContextualizeMessage } from '../../../shared/components/ContextualizeMessage';
import { MarkdownRender } from '../../../shared/components/MarkdownRender';

interface LessonContentProps {
  data: LessonDataAPI;
}

export default function LessonContent({ data }: LessonContentProps) {
  return (
    <div id="tour-lesson-content" className="w-full animate-fadeIn">
      {/* 3. CẬP NHẬT: Đã gỡ bỏ Nút Đỏ và các Hook gọi Store thừa thãi */}
      <h1 className="text-4xl font-bold text-[#1E3A8A] border-gray-200 pb-8 m-0">
        Lesson {data.order}: {data.title}
      </h1>

      <div id="tour-lesson-context">
        <ContextualizeMessage itemId={data._id} type="lesson" />
      </div>

      <MarkdownRender content={data.content} className="pt-7" />
    </div>
  );
}
