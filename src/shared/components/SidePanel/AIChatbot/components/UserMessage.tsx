import { useState, useRef, useEffect } from 'react';
import icon_arrow_down from '../../assets/icon_arrow_down.svg';

interface UserMessageProps {
  content: string;
}

export function UserMessage({ content }: UserMessageProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const textRef = useRef<HTMLParagraphElement>(null);

  // Kiểm tra xem chữ có bị tràn ra khỏi 2 dòng không
  useEffect(() => {
    if (textRef.current) {
      setIsOverflowing(textRef.current.scrollHeight > textRef.current.clientHeight);
    }
  }, [content]);

  return (
    <div className="flex flex-col items-end w-full mb-6 animate-fadeIn">
      {/* Ô Bubble tin nhắn: Bo góc trái trên 2px, 3 góc còn lại bo tròn mạnh (3xl) */}
      <div className="bg-gray-100 rounded-tr-[2px] rounded-br-3xl rounded-bl-3xl rounded-tl-3xl p-3 max-w-[85%] relative shadow-sm">
        <p
          ref={textRef}
          className={`text-sm text-slate-800 whitespace-pre-wrap leading-relaxed ${
            !isExpanded ? 'line-clamp-2' : ''
          }`}
        >
          {content}
        </p>

        {/* Nút xổ xuống/thu gọn (Chỉ check isOverflowing để nút luôn tồn tại khi chữ dài) */}
        {isOverflowing && (
          <button
            // 1. SỬA: Đổi thành Toggle state (!isExpanded)
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-1.5 flex items-center justify-center w-full hover:bg-gray-200 rounded-full py-0.5 transition-colors"
            title={isExpanded ? 'Thu gọn' : 'Xem thêm'}
          >
            <img
              src={icon_arrow_down}
              alt="Toggle Expand"
              // 2. SỬA: Thêm transition-transform và điều kiện rotate-180
              className={`w-4 h-4 opacity-60 transition-transform duration-300 ease-in-out ${
                isExpanded ? 'rotate-180' : ''
              }`}
            />
          </button>
        )}
      </div>
    </div>
  );
}
