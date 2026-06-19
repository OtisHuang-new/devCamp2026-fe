// Vị trí: src/shared/components/TextSelectionPopover/index.tsx
import { useTextSelection } from '../../hooks/useTextSelection';
import { useAIChatStore } from '../../store/useAIChatStore';
import help_icon from '../../Assets/help_outline.svg';

export function TextSelectionPopover() {
  // 1. Nhận thêm cờ isDragging từ Hook
  const { text, x, y, isVisible, isDragging } = useTextSelection();
  const { isChatMounted, isAILoading, setExternalQuery } = useAIChatStore();

  if (!isVisible || !isChatMounted) return null;

  const handleAskAI = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAILoading) return;

    const formattedQuery = `Explain this for me:\n"${text}"`;
    setExternalQuery(formattedQuery);
  };

  return (
    <div
      id="ai-text-popover"
      onMouseDown={handleAskAI}
      style={{
        position: 'fixed',
        left: `${x}px`,
        top: `${y}px`,
        zIndex: 9999,
      }}
      // 2. SENIOR FIX ĐỈNH CAO TẠI ĐÂY:
      // - Đổi `transition-all` thành `transition` (Để css bỏ qua tọa độ x, y -> Di chuyển ngay lập tức).
      // - Khi `isDragging` = true -> Trở nên mờ đi 1 chút (opacity-60), thu nhỏ tí xíu (scale-95)
      //   và ĐẶC BIỆT LÀ `pointer-events-none` (Con trỏ chuột sẽ lướt xuyên qua nút, không bị click nhầm).
      className={`group flex items-center rounded-full shadow-md transition duration-200 overflow-hidden
        ${isDragging ? 'pointer-events-none opacity-60 scale-95' : 'opacity-100 scale-100'}
        ${
          isAILoading
            ? 'bg-gray-400 cursor-wait opacity-80'
            : 'bg-[#1E3A8A] cursor-pointer hover:bg-blue-800 shadow-blue-900/30'
        }
      `}
    >
      <div className="w-7 h-7 rounded-full bg-blue-800 flex items-center justify-center shrink-0">
        {isAILoading ? (
          <svg
            className="animate-spin w-5 h-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        ) : (
          <img src={help_icon} alt="Help" className="w-7 h-7 brightness-0 invert" />
        )}
      </div>

      <span
        className={`text-white font-bold text-sm whitespace-nowrap overflow-hidden transition-all duration-300 ease-out
          ${isAILoading ? 'max-w-0' : 'max-w-0 group-hover:max-w-[80px] group-hover:pr-2 group-hover:pl-1'}
        `}
      >
        Explain
      </span>
    </div>
  );
}
