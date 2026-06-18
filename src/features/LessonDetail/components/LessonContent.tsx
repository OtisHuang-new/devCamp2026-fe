import type { LessonDataAPI } from '../types/lessonTypes';
import ContextualizeMessage from './ContextualizeMessage';
import { MarkdownRender } from '../../../shared/components/MarkdownRender';

interface LessonContentProps {
  data: LessonDataAPI;
}

export default function LessonContent({ data }: LessonContentProps) {
  return (
    <div className="w-full animate-fadeIn">
      <h1 className="text-4xl font-bold text-[#1E3A8A] border-t border-gray-200 py-8">
        Lesson {data.order}: {data.title}
      </h1>

      <ContextualizeMessage lessonId={data._id} />

      {/* Gọi Component mới, tự động ăn class CSS mặc định đã cấu hình */}
      <MarkdownRender content={data.content} />
    </div>
  );
}
