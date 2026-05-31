import React from 'react';
import finish_icon from '../Assets/finish_lesson_icon.svg'; // BỔ SUNG IMPORT

interface LessonButtonProps {
  iconPath: string;
  onClick?: () => void;
  largerIcon?: boolean; // Thêm prop này để phóng to icon nếu cần
  title?: string; // BỔ SUNG THÊM DÒNG NÀY
  status?: 'completed' | 'current' | 'locked'; // BỔ SUNG THÊM DÒNG NÀY
}

const LessonButton: React.FC<LessonButtonProps> = ({
  iconPath,
  onClick,
  largerIcon = false,
  title,
  status = 'locked',
}) => {
  // BỔ SUNG: Logic xác định màu sắc và icon
  const isCompleted = status === 'completed';
  const isLocked = status === 'locked';

  const bgClass = isCompleted ? 'bg-[#6D7EAE]' : isLocked ? 'bg-[#898989]' : 'bg-primary';
  const shadowClass = isCompleted ? 'bg-[#374262]' : isLocked ? 'bg-[#6D6B6D]' : 'bg-[#051338]';
  const displayIcon = isCompleted ? finish_icon : iconPath;

  // --- BỔ SUNG: Hàm xử lý click chặn tác vụ nếu bài học đang bị khóa ---
  const handleClick = () => {
    if (!isLocked && onClick) {
      onClick();
    }
  };

  // --- BỔ SUNG: Đổi con trỏ chuột thành hình tròn gạch chéo nếu bị khóa ---
  const cursorClass = isLocked ? 'cursor-not-allowed opacity-90' : 'cursor-pointer group';

  return (
    <div
      className={`relative w-[70px] h-[70px] ${cursorClass}`}
      onClick={handleClick}
      title={title}
    >
      <div
        className={`absolute inset-0 ${shadowClass} rounded-full translate-y-[8px] transition-colors duration-300`}
      />

      {/* Chỉ thêm hiệu ứng hover (brightness-90) khi nút không bị khóa */}
      <div
        className={`relative w-full h-full ${bgClass} rounded-full flex items-center justify-center transition-all duration-300 ${!isLocked ? 'hover:brightness-90' : ''}`}
      >
        <img
          src={displayIcon}
          alt="lesson-icon"
          // BỔ SUNG: pointer-events-none và select-none vào cuối chuỗi className
          className={`${largerIcon ? 'w-[60px] h-[60px]' : 'w-8 h-8'} object-contain pointer-events-none select-none`}
        />
      </div>
    </div>
  );
};

export default LessonButton;
