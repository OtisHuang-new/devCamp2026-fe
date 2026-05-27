// src/shared/Buttons/CodeToggleButton/index.tsx
import React from 'react';
import icon_off from './Assets/icon_code_toggle_off.svg';
import icon_on from './Assets/icon_code_toggle_on.svg';

interface CodeToggleButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  isInsideEditor?: boolean;
}

const CodeToggleButton: React.FC<CodeToggleButtonProps> = ({
  isOpen,
  onToggle,
  isInsideEditor = false,
}) => {
  return (
    <button
      onClick={onToggle}
      className={`transition-all duration-300 flex items-start overflow-hidden
                /* Nếu ở ngoài: fixed góc trái, có shadow. Nếu ở trong: relative, không shadow */
                ${
                  isInsideEditor
                    ? 'relative p-0'
                    : 'fixed bottom-0 left-8 h-11 z-[100] pt-3 px-3 rounded-[4px] shadow-lg shadow-black/20'
                }
                /* Màu nền dựa trên trạng thái Đóng/Mở */
                ${isOpen ? 'bg-transparent' : 'bg-[#1E3A8A] hover:bg-[#112255]'}
            `}
    >
      <img src={isOpen ? icon_on : icon_off} alt="Toggle" className="w-14 h-auto block" />
    </button>
  );
};

export default CodeToggleButton;
