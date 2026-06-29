// Vị trí: src/features/Roadmap/Components/HeaderInfo.tsx
import { forwardRef } from 'react';
import type { ThemeColor } from '../types/roadmapTypes';

interface HeaderInfoProps {
  chapterTitle: string;
  lessonTitle: string;
  onBackClick?: () => void;
  theme?: ThemeColor; // 1. NHẬN PROP
}

const HeaderInfo = forwardRef<HTMLDivElement, HeaderInfoProps>(
  ({ chapterTitle, lessonTitle, theme }, ref) => {
    return (
      <div ref={ref} className="sticky top-3 z-20 w-full py-2 transition-colors duration-100">
        {/* 2. ĐỔI LẠI CLASS bg-primary THÀNH DYNAMIC THEME */}
        <div
          className={`${theme?.bg || 'bg-primary'} text-white p-5 rounded-2xl shadow-lg max-w-2xl`}
        >
          <div className="flex items-center gap-2 text-sm mb-1 hover:underline w-fit opacity-90">
            <span>Chapter Infomation</span>
          </div>

          <h2 className="text-lg font-bold tracking-wide">
            {chapterTitle}. {lessonTitle}
          </h2>
        </div>
      </div>
    );
  },
);

export default HeaderInfo;
