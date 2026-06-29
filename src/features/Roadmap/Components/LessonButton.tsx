// Vị trí: src/features/Roadmap/Components/LessonButton.tsx
import React from 'react';
import finish_icon from '../Assets/finish_lesson_icon.svg';
import type { ThemeColor } from '../types/roadmapTypes';

interface LessonButtonProps {
  iconPath: string;
  onClick?: () => void;
  largerIcon?: boolean;
  title?: string;
  status?: 'completed' | 'current' | 'locked';
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

      {/* LỚP BÓNG (SHADOW LAYER) */}
      <div
        className={`absolute inset-0 ${shadowClass} rounded-full translate-y-[8px] transition-colors duration-300 overflow-hidden`}
      >
        {/* 1. SENIOR FIX: Phủ lớp sương trắng để làm nhạt màu bóng (Không làm trong suốt) */}
        {isCompleted && <div className="absolute inset-0 bg-white/50" />}
      </div>

      {/* LỚP MẶT NÚT (TOP LAYER CONTAINER) */}
      <div
        className={`relative w-full h-full rounded-full flex items-center justify-center transition-all duration-150 ease-out 
          transform-gpu will-change-transform 
          ${
            !isLocked
              ? 'hover:brightness-90 group-hover:translate-y-[3px] group-active:translate-y-[8px]'
              : ''
          }`}
      >
        {/* LỚP MÀU NỀN */}
        <div
          className={`absolute inset-0 rounded-full ${bgClass} transition-colors duration-300 overflow-hidden`}
        >
          {/* 2. SENIOR FIX: Phủ lớp sương trắng để làm nhạt màu nền, CẢN TUYỆT ĐỐI tầm nhìn xuống lớp bóng */}
          {isCompleted && <div className="absolute inset-0 bg-white/50" />}
        </div>

        {/* LỚP ICON */}
        <img
          src={displayIcon}
          alt="lesson-icon"
          className={`relative z-10 ${largerIcon ? 'w-[60px] h-[60px]' : 'w-8 h-8'} object-contain pointer-events-none select-none 
          transform-gpu`}
        />
      </div>
    </div>
  );
};

export default LessonButton;
