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
      className="flex flex-col items-center justify-center w-12 h-12 px-10 py-1 bg-white border-2 border-gray-200 rounded-[4px] shadow-md hover:bg-gray-50 hover:border-primary text-gray-500 hover:text-primary transition-all group animate-fadeIn"
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
