import React, { forwardRef } from 'react';

interface HeaderInfoProps {
  chapterTitle: string;
  lessonTitle: string;
  onBackClick?: () => void;
}

const HeaderInfo = forwardRef<HTMLDivElement, HeaderInfoProps>(
  ({ chapterTitle, lessonTitle, onBackClick }, ref) => {
    return (
      /* Sticky Wrapper: Giúp thanh này luôn nằm trên cùng khi scroll.
           z-20 để đảm bảo nó nằm trên các LessonButton.
        */
      <div ref={ref} className="sticky top-3 z-20 w-full py-2">
        <div className="bg-primary text-white p-5 rounded-2xl shadow-lg max-w-2xl">
          {/* Nút Back: Clickable text */}
          <div
            onClick={onBackClick}
            className="flex items-center gap-2 text-sm mb-1 cursor-pointer hover:underline w-fit opacity-90"
          >
            <span>←</span>
            <span>Back to chapter view</span>
          </div>

          {/* Thông tin Lesson */}
          <h2 className="text-lg font-bold tracking-wide">
            {chapterTitle}. {lessonTitle}
          </h2>
        </div>
      </div>
    );
  },
);

export default HeaderInfo;
