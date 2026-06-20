import { useNavigate } from 'react-router-dom';

interface ReturnProps {
  text: string;
}

export function Return({ text }: ReturnProps) {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-[15px] border-b border-gray-800 pb-3">
      <button
        onClick={() => navigate(-1)}
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
