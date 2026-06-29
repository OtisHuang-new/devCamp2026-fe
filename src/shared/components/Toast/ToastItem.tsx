import { useEffect, useRef, useState, useCallback } from 'react';
import { useToastStore, type ToastMessage } from '../../store/useToastStore';

interface ToastItemProps {
  toast: ToastMessage;
}

export function ToastItem({ toast }: ToastItemProps) {
  const removeToast = useToastStore((state) => state.removeToast);

  const [isExiting, setIsExiting] = useState<boolean>(false);
  const [isHovered, setIsHovered] = useState<boolean>(false);

  // Dùng useRef để giữ state nội bộ không gây re-render
  const remainingTime = useRef<number>(toast.duration);
  const startTimestamp = useRef<number>(0);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // 1. Hàm kích hoạt hiệu ứng Fade-out trước khi xóa khỏi Store
  const handleClose = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => removeToast(toast.id), 300); // Đợi 300ms cho animation trượt xuống
  }, [removeToast, toast.id]);

  // 2. Logic chạy Timer
  const startTimer = useCallback(() => {
    startTimestamp.current = Date.now();
    timerRef.current = setTimeout(handleClose, remainingTime.current);
  }, [handleClose]);

  // 3. Logic dừng Timer khi Hover
  const pauseTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      const elapsed = Date.now() - startTimestamp.current;
      remainingTime.current -= elapsed;
    }
  }, []);

  // Strict Mode: Khởi chạy và dọn dẹp an toàn
  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [startTimer]);

  return (
    <div
      onMouseEnter={() => {
        setIsHovered(true);
        pauseTimer();
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        startTimer();
      }}
      onClick={handleClose}
      className={`pointer-events-auto relative border-t border-l border-r  border-white flex items-center gap-3 overflow-hidden rounded-lg bg-[#1a1a1a] px-4 py-3 min-w-[320px] max-w-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer transition-all duration-300 ease-in-out ${
        isExiting ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100 animate-slideUp'
      }`}
    >
      {/* 4. SENIOR FIX: Phân nhánh render Icon dựa vào giá trị isWarning */}
      {toast.isWarning ? (
        // Icon Warning (Đỏ - Chấm than)
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#E53E3E]">
          <span className="text-[12px] font-bold text-white">!</span>
        </div>
      ) : (
        // Icon Success (Xanh - Dấu Tick)
        <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#22C55E]">
          <svg
            className="w-3.5 h-3.5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="3"
              d="M5 13l4 4L19 7"
            ></path>
          </svg>
        </div>
      )}

      {/* Thông điệp */}
      <p className="flex-1 text-sm font-medium text-white">{toast.text}</p>

      {/* Dấu X (Close) */}
      <button className="text-gray-400 hover:text-white transition-colors">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      {/* Thanh Progress Bar - Đóng băng animation bằng CSS khi hover */}
      <div
        className="absolute bottom-0 left-0 h-[4px] bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 origin-left"
        style={{
          width: '100%',
          animation: `toast-shrink ${toast.duration}ms linear forwards`,
          animationPlayState: isHovered ? 'paused' : 'running',
        }}
      />
    </div>
  );
}
