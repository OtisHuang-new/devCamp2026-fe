import React from 'react';
import type { LessonData } from '../LessonData';

interface LessonContentProps {
  data: LessonData;
}

const LessonContent: React.FC<LessonContentProps> = ({ data }) => {
  return (
    <div className="w-full animate-fadeIn">
      {/* 1. Main Title */}
      <h1 className="text-4xl font-bold text-[#1E3A8A] border-t border-gray-200 py-8">
        {data.title}
      </h1>

      {/* 2. Loop through sections */}
      <div className="space-y-5">
        {data.sections.map((section) => (
          <div key={section.id} className="flex flex-col gap-3">
            {/* Subtitle */}
            {section.subtitle && (
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                {section.subtitle}
              </h2>
            )}

            {/* Paragraph content */}
            {section.content && (
              <p className="text-base text-slate-700 leading-relaxed font-medium">
                {section.content}
              </p>
            )}

            {/* Bullet list items */}
            {section.listItems && section.listItems.length > 0 && (
              <ul className="list-disc ml-6 space-y-2">
                {section.listItems.map((item, index) => (
                  <li key={index} className="text-base text-slate-700 leading-relaxed font-medium">
                    {/* Highlight các từ khóa quan trọng nếu cần (optional) */}
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default LessonContent;
