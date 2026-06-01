// Vị trí: src/features/Roadmap/Components/SideLessonSection.tsx
import React from 'react';
import type { ChapterDataAPI } from '../types/roadmapTypes';
import SideLessonItem from './SideLessonItem';

interface SideLessonSectionProps {
  chapterData: ChapterDataAPI;
  onLessonClick: (id: string) => void;
}

const SideLessonSection: React.FC<SideLessonSectionProps> = ({ chapterData, onLessonClick }) => {
  if (!chapterData || !chapterData.lessons || chapterData.lessons.length === 0) return null;

  return (
    <div className="w-[350px] border-2 border-[#6D7EAE] rounded-lg p-5 bg-white shadow-sm flex flex-col gap-4">
      <h3 className="font-extrabold text-xl text-primary uppercase tracking-wide">Side Lesson</h3>
      <div className="flex flex-col gap-3">
        {chapterData.lessons.map((lesson, index) => (
          <SideLessonItem
            key={lesson._id}
            index={index}
            lesson={lesson}
            onClick={() => onLessonClick(lesson._id)}
          />
        ))}
      </div>
    </div>
  );
};

export default SideLessonSection;
