// C:\Users\Admin\Desktop\devCamp2026\devCamp2026-fe\src\shared\components\Buttons\ScrollToTopButton\index.tsx
import React from 'react';

interface ScrollToTopButtonProps {
  isVisible: boolean;
  onClick: () => void;
}

const ScrollToTopButton: React.FC<ScrollToTopButtonProps> = ({ isVisible, onClick }) => {
  if (!isVisible) return null;

  return (
    <button
      onClick={onClick}
      className="flex flex-col items-center justify-center w-14 h-14 px-2 py-2 bg-white border-2 border-gray-200 rounded-[9999px] shadow-md hover:bg-gray-50 hover:border-primary text-gray-500 hover:text-primary transition-all group animate-fadeIn"
    >
      <svg
        className="w-5 h-5 mb-0.5 group-hover:-translate-y-0.5 transition-transform"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2.5}
          d="M5 10l7-7m0 0l7 7m-7-7v18"
        />
      </svg>
      <span className="text-[10px] font-bold">Top</span>
    </button>
  );
};

export default ScrollToTopButton;
