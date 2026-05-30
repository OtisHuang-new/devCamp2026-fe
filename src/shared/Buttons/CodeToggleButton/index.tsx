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
      // --- 3. THÊM CLASS 'group' VÀ 'relative' (nếu chưa có) ---
      className={`group transition-all duration-300 flex items-start overflow-visible
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

      {/* --- 4. BỔ SUNG BUBBLE MESSAGE TOOLTIP --- */}
      <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-[300ms] pointer-events-none whitespace-nowrap bg-[#1E1E1E] text-gray-300 text-xs px-3 py-2.5 rounded-lg shadow-xl border border-gray-700 flex items-center gap-1.5 z-[110]">
        {/* Mũi tên chỉ ngược lại vào nút */}
        <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-2 bg-[#1E1E1E] border-l border-b border-gray-700 rotate-45"></div>

        <span>Short cut :</span>
        <span className="bg-gray-800 text-white px-1.5 py-0.5 rounded font-mono font-bold shadow-sm">
          Ctrl + `
        </span>
        <span>or</span>
        <span className="bg-gray-800 text-white px-1.5 py-0.5 rounded font-mono font-bold shadow-sm">
          Cmd + `
        </span>
      </div>
      {/* ---------------------------------------- */}
    </button>
  );
};

export default CodeToggleButton;
