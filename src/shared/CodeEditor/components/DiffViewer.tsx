import React from 'react';
import { diffChars } from 'diff';

interface DiffViewerProps {
  expected: string;
  actual: string;
}

const DiffViewer: React.FC<DiffViewerProps> = ({ expected, actual }) => {
  const diff = diffChars(expected || '', actual || '');

  return (
    <div className="w-full bg-[#2A2A2A] p-3 rounded-lg min-h-[40px] font-mono text-sm leading-relaxed whitespace-pre-wrap">
      {diff.map((part, index) => {
        const spanClass = part.added
          ? 'bg-red-500/30 text-red-400 font-bold px-0.5 rounded'
          : part.removed
            ? 'bg-green-500/20 text-green-400 font-bold line-through px-0.5 rounded opacity-60'
            : 'text-gray-300'; // Giống nhau thì màu chữ xám bình thường

        return (
          <span key={index} className={spanClass}>
            {part.value}
          </span>
        );
      })}
    </div>
  );
};

export default DiffViewer;
