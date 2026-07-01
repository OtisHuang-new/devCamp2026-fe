// Vị trí: src/shared/components/CodeEditor/components/Buttons/CodeToggleButton/index.tsx
import React, { useState, useEffect } from 'react'; // 1. Bổ sung Import hooks
import icon_off from './Assets/icon_code_toggle_off.svg';
import icon_on from './Assets/icon_code_toggle_on.svg';

interface CodeToggleButtonProps {
  isOpen: boolean;
  onToggle: () => void;
  isInsideEditor?: boolean;
  showHintBubble?: boolean; // 2. SENIOR FIX: Khai báo Prop mới
}

const CodeToggleButton: React.FC<CodeToggleButtonProps> = ({
  isOpen,
  onToggle,
  isInsideEditor = false,
  showHintBubble = false,
}) => {
  // --- LOGIC ANIMATION & DISMISS ---
  const [dismissed, setDismissed] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // 1. SENIOR FIX: Thêm state mốc (Memo) để theo dõi trạng thái
  const [prevActive, setPrevActive] = useState(false);

  // Bubble chỉ kích hoạt khi: Được cấp phép hiện + Chưa bị user tắt + Cửa sổ Code chưa mở + Đang đứng ở màn ngoài
  const active = showHintBubble && !dismissed && !isOpen && !isInsideEditor;

  // ----------------------------------------------------------------------
  // 2. SENIOR FIX: UPDATE STATE DURING RENDER (Chuẩn React 19)
  // Xóa bỏ hoàn toàn tính toán đồng bộ khỏi useEffect để diệt lỗi Cascading
  // ----------------------------------------------------------------------
  if (active !== prevActive) {
    setPrevActive(active); // Chốt mốc ngay lập tức
    if (active) {
      setIsRendered(true); // Bật DOM ngay lập tức
    } else {
      setIsVisible(false); // Tắt Opacity ngay lập tức
    }
  }

  // ----------------------------------------------------------------------
  // 3. SENIOR FIX: EFFECT CHỈ DÙNG CHO SIDE-EFFECT (Hẹn giờ Animation)
  // ----------------------------------------------------------------------
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (active) {
      // Đợi 50ms để DOM kịp vẽ trước khi kích hoạt CSS Transition Opacity
      timer = setTimeout(() => setIsVisible(true), 50);
    } else {
      // Đợi đúng 200ms bằng thời gian Fade-out để gỡ thẻ div khỏi DOM (Tối ưu Memory)
      timer = setTimeout(() => setIsRendered(false), 200);
    }

    return () => clearTimeout(timer);
  }, [active]);

  const handleDismissBubble = (e: React.MouseEvent) => {
    e.stopPropagation(); // Ngăn chặn việc click bubble bị lan xuống nút Toggle
    setDismissed(true);
  };

  return (
    <>
      {/* 3. SENIOR FIX: Render Bubble tách biệt khỏi thẻ <button> để HTML hợp lệ */}
      {isRendered && (
        <div
          onClick={handleDismissBubble}
          className={`fixed bottom-[55px] left-8 z-[110] cursor-pointer transition-opacity duration-200 ease-in-out ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          {/* Thân Bubble */}
          <div className="bg-[#22C55E] text-white px-4 py-2.5 rounded-xl shadow-lg shadow-green-500/30 text-base font-bold flex items-center gap-2">
            <span>Click here to start doing exercise !</span>
            <svg
              className="w-4 h-4 opacity-70 hover:opacity-100 transition-opacity"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M6 18L18 6M6 6l12 12"
              ></path>
            </svg>
          </div>
          {/* Đuôi nhọn trỏ xuống nút */}
          <div className="absolute top-full left-6 w-0 h-0 border-x-8 border-x-transparent border-t-[8px] border-t-[#22C55E]"></div>
        </div>
      )}

      <button
        onClick={onToggle}
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

        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-[300ms] pointer-events-none whitespace-nowrap bg-[#1E1E1E] text-gray-300 text-xs px-3 py-2.5 rounded-lg shadow-xl border border-gray-700 flex items-center gap-1.5 z-[110]">
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
      </button>
    </>
  );
};

export default CodeToggleButton;
