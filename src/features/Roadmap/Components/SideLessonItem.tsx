// Vị trí: src/features/Roadmap/Components/SideLessonItem.tsx
import React from 'react';
import type { LessonData } from '../types/roadmapTypes';

interface SideLessonItemProps {
  lesson: LessonData;
  index: number;
  onClick: () => void;
}

const SideLessonItem: React.FC<SideLessonItemProps> = ({ lesson, index, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="bg-[#F4F5F7] py-3 px-4 rounded-r-md border-l-4 border-[#6D7EAE] cursor-pointer hover:bg-gray-200 transition-colors flex items-center"
    >
      <span className="text-black font-medium text-[16px]">
        Lesson {index + 1}: {lesson.title}
      </span>
    </div>
  );
};

export default SideLessonItem;
