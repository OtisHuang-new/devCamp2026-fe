import React from 'react';
import type { ExerciseData } from '../LessonData';

interface ExerciseSectionProps {
  data: ExerciseData;
}

const ExerciseSection: React.FC<ExerciseSectionProps> = ({ data }) => {
  return (
    <div className="w-full animate-fadeIn">
      {/* 1. Section Title */}
      <h2 className="text-4xl font-bold text-[#1E3A8A] mb-6">Exercise</h2>

      {/* 2. Exercise Card */}
      <div className="bg-[#F8F9FA] rounded-2xl py-8 px-4 border border-gray-100 shadow-sm">
        {/* Title & Difficulty */}
        <div className="flex flex-col gap-3 mb-6">
          <h3 className="text-2xl font-extrabold text-slate-800 tracking-tight">{data.title}</h3>
          <span className="w-fit px-3 py-1 bg-[#22C55E] text-white text-xs font-bold rounded-full">
            {data.difficulty}
          </span>
        </div>

        {/* Description */}
        <p className="text-slate-700 font-medium leading-relaxed mb-8">{data.description}</p>

        {/* Examples Section */}
        <div className="space-y-6">
          {data.examples.map((ex, index) => (
            <div key={index} className="flex flex-col gap-2">
              <p className="text-sm font-bold text-slate-600">Example {index + 1}:</p>
              <div className="bg-white border border-slate-300 rounded-xl p-4 shadow-inner">
                <div className="font-mono text-sm flex flex-col gap-1">
                  <p>
                    <span className="font-bold">Input:</span> {ex.input}
                  </p>
                  <p>
                    <span className="font-bold">Output:</span> {ex.output}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExerciseSection;
