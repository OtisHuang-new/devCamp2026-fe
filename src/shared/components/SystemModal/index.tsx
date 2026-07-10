// Vị trí: src/shared/components/SystemModal/index.tsx
import React, { useEffect } from 'react';

export interface SystemModalProps {
  isOpen: boolean;
  onClose: () => void;
  mascotSrc?: string;
  mascotSize?: number | string;
  description?: React.ReactNode;
  primaryButton?: {
    label: string;
    onClick: () => void;
  };
  secondaryButton?: {
    label: string;
    onClick: () => void;
    isDanger?: boolean;
  };
}

export function SystemModal({
  isOpen,
  onClose,
  mascotSrc,
  mascotSize = 160,
  description,
  primaryButton,
  secondaryButton,
}: SystemModalProps) {
  // SENIOR UX: Chống cuộn trang (Scroll Lock) và hỗ trợ phím ESC khi Modal mở
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    // Lớp Wrapper ngoài cùng: z-index cực cao để luôn nằm trên cùng
    <div className="fixed inset-0 z-[9999] flex items-center justify-center">
      {/* 1. Nền tối (Backdrop): Bấm vào đây để đóng */}
      <div className="absolute inset-0 bg-black/40 animate-fadeIn" onClick={onClose} />

      {/* 2. Khối nội dung Modal */}
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-[420px] px-6 pt-5 pb-4 flex flex-col items-center text-center animate-slideUp">
        {/* Nút X ở góc phải */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition-colors p-1"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Mascot (Nếu có truyền vào) */}
        {mascotSrc && (
          <img
            src={mascotSrc}
            alt="System Mascot"
            style={{ width: mascotSize, height: mascotSize }}
            className="w-40 h-40 object-contain select-none pointer-events-none"
          />
        )}

        {/* Nội dung Text */}
        {description && (
          <p className="text-black/80 font-bold text-[18px] mb-7 px-2 leading-relaxed">
            {description}
          </p>
        )}

        {/* 3. Khối Nút Bấm (Tự động linh hoạt dựa trên Props) */}
        <div className="w-full flex flex-col gap-1 mt-auto">
          {primaryButton && (
            <button
              onClick={primaryButton.onClick}
              className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-primary hover:opacity-90 transition-all active:scale-95 shadow-md shadow-primary/20"
            >
              {primaryButton.label}
            </button>
          )}

          {secondaryButton && (
            <button
              onClick={secondaryButton.onClick}
              // 2. SENIOR FIX: Đổi màu dựa theo cờ isDanger
              className={`flex-1 py-3 px-4 rounded-xl font-bold transition-all ${
                secondaryButton.isDanger
                  ? 'text-red-500 hover:underline '
                  : 'text-gray-600 bg-white border-gray-200 hover:bg-gray-50 hover:border-gray-300'
              }`}
            >
              {secondaryButton.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
