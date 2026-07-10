// Vị trí: src/shared/components/Return/index.tsx
import { useNavigate } from 'react-router-dom';

export interface ReturnProps {
  text: string;
  to?: string; // 1. SENIOR FIX: Bổ sung prop tùy chọn để dịch chuyển thẳng đến đường dẫn mong muốn
}

export function Return({ text, to }: ReturnProps) {
  const navigate = useNavigate();

  // 2. SENIOR FIX: Hàm điều hướng kiểm tra đích đến
  const handleReturn = () => {
    if (to) {
      navigate(to); // Nếu có đích đến -> Bay thẳng về đó (1 click ăn luôn)
    } else {
      navigate(-1); // Nếu không có -> Dùng cơ chế lùi 1 bước cũ
    }
  };

  return (
    <div className="flex justify-between items-center mb-[15px] border-b border-gray-800 pb-3">
      <button
        onClick={handleReturn}
        className="flex items-center text-gray-900 font-medium transition-colors hover:opacity-70"
      >
        <svg
          className="w-4 h-4 mr-2"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 19l-7-7m0 0l7-7m-7 7h18"
          ></path>
        </svg>
        {text}
      </button>
    </div>
  );
}
