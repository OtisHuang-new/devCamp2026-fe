import React from 'react';

interface LessonButtonProps {
  iconPath: string;
  onClick?: () => void;
  largerIcon?: boolean; // Thêm prop này để phóng to icon nếu cần
}

const LessonButton: React.FC<LessonButtonProps> = ({ iconPath, onClick, largerIcon = false }) => {
  return (
    /* Wrapper: Giữ nguyên size 50x50 và đế 3D cao 6px */
    <div className="relative w-[50px] h-[50px] group cursor-pointer" onClick={onClick}>
      {/* Lớp Shadow (Đế 3D): Cố định */}
      <div className="absolute inset-0 bg-[#040257] rounded-full translate-y-[6px]" />

      {/* Lớp Nút chính:
               - Chỉ còn default state và hover state.
               - Đã XÓA 'active:translate-y-[2px]' (hiệu ứng nhấn xuống).
               - Hover: làm nút tối lại (brightness-90).
            */}
      <div className="relative w-full h-full bg-[#1E3A8A] rounded-full flex items-center justify-center transition-all duration-100 hover:brightness-90">
        <img
          src={iconPath}
          alt="lesson-icon"
          // Phóng to Cup nếu largerIcon là true (w-9 h-9), nếu không giữ nguyên size (w-6 h-6)
          className={`${largerIcon ? 'w-11 h-11' : 'w-6 h-6'} object-contain`}
        />
      </div>
    </div>
  );
};

export default LessonButton;
