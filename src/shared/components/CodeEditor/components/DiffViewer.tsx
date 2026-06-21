import React from 'react';
import { diffChars } from 'diff';

interface DiffViewerProps {
  expected: string;
  actual: string;
}

const DiffViewer: React.FC<DiffViewerProps> = ({ expected, actual }) => {
  const diff = diffChars(expected || '', actual || '');

  return (
    <div className="w-full bg-[#2A2A2A] p-3 rounded-lg min-h-[40px] font-mono text-sm leading-relaxed whitespace-pre-wrap break-all">
      {diff.map((part, index) => {
        // 1. SENIOR FIX: Bỏ class `line-through` và `opacity-60`.
        // Chỉnh lại padding ngang (px-0.5) để màu nền bọc sát ký tự hơn.
        const spanClass = part.added
          ? 'bg-red-500/40 text-red-300 font-bold px-[0.5px] mx-[1px] rounded-[1px]'
          : part.removed
            ? 'bg-green-500/40 text-green-300 font-bold px-[0.5px] mx-[1px] rounded-[1px]'
            : 'text-gray-300';

        // 2. SENIOR UX TRICK: Nếu là phần bị sai (added/removed),
        // ta biến các khoảng trắng (Space) thành dấu chấm lửng (·) để user dễ nhận diện mắt thường.
        const displayValue =
          part.added || part.removed ? part.value.replace(/ /g, ' ') : part.value;

        return (
          <span key={index} className={spanClass}>
            {displayValue}
          </span>
        );
      })}
    </div>
  );
};

export default DiffViewer;
