import React from 'react';
import finish_icon from '../Assets/finish_lesson_icon.svg'; // BỔ SUNG IMPORT
import type { ThemeColor } from '../types/roadmapTypes';

interface LessonButtonProps {
  iconPath: string;
  onClick?: () => void;
  largerIcon?: boolean; // Thêm prop này để phóng to icon nếu cần
  title?: string; // BỔ SUNG THÊM DÒNG NÀY
  status?: 'completed' | 'current' | 'locked'; // BỔ SUNG THÊM DÒNG NÀY
  theme?: ThemeColor;
}

const LessonButton: React.FC<LessonButtonProps> = ({
  iconPath,
  onClick,
  largerIcon = false,
  title,
  status = 'locked',
  theme,
}) => {
  const isCompleted = status === 'completed';
  const isLocked = status === 'locked';

  const bgClass = isLocked ? 'bg-[#898989]' : theme?.bg || 'bg-primary';
  const shadowClass = isLocked ? 'bg-[#6D6B6D]' : theme?.shadow || 'bg-[#051338]';

  const displayIcon = isCompleted && !largerIcon ? finish_icon : iconPath;

  const handleClick = () => {
    if (!isLocked && onClick) {
      onClick();
    }
  };

  const cursorClass = isLocked ? 'cursor-not-allowed opacity-90' : 'cursor-pointer group';

  return (
    <div
      className={`relative w-[70px] h-[70px] ${cursorClass}`}
      onClick={handleClick}
      title={title}
    >
      {status === 'current' && (
        <div className="absolute top-1/2 right-[100%] mr-5 -translate-y-[17px] bg-white border-2 border-primary text-primary font-extrabold text-[20px] px-3 py-1.5 rounded-xl shadow-md whitespace-nowrap z-10 flex items-center justify-center animate-fadeIn">
          Your current Lesson
          <div className="absolute top-1/2 -right-[7px] -translate-y-1/2 w-0 h-0 border-y-[6px] border-y-transparent border-l-[6px] border-l-primary"></div>
          <div className="absolute top-1/2 -right-[4px] -translate-y-1/2 w-0 h-0 border-y-[4px] border-y-transparent border-l-[4px] border-l-white"></div>
        </div>
      )}

      <div
        className={`absolute inset-0 ${shadowClass} rounded-full translate-y-[8px] transition-colors duration-300`}
      />

      {/* Lớp mặt nút (Top Layer) */}
      <div
        className={`relative w-full h-full ${bgClass} rounded-full flex items-center justify-center transition-all duration-150 ease-out 
          transform-gpu will-change-transform /* 1. SENIOR FIX: Bật GPU và khóa nét lớp mặt */
          ${
            !isLocked
              ? 'hover:brightness-90 group-hover:translate-y-[3px] group-active:translate-y-[8px]'
              : ''
          }`}
      >
        <img
          src={displayIcon}
          alt="lesson-icon"
          className={`${largerIcon ? 'w-[60px] h-[60px]' : 'w-8 h-8'} object-contain pointer-events-none select-none 
          transform-gpu /* 2. SENIOR FIX: Khóa nét bức ảnh tuyệt đối */`}
        />
      </div>
    </div>
  );
};

export default LessonButton;
