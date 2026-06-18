import icon_copy from '../assets/icon_copy.svg';
// Import bot avatar từ alias thư mục tổng (đảm bảo khớp với project của bạn)
import bot_like from '@Assets/Mascots/bot_like.svg';
// Nhúng Markdown Render
import { MarkdownRender } from '../../../../components/MarkdownRender';

interface AIMessageProps {
  content: string;
}

export function AIMessage({ content }: AIMessageProps) {
  function handleCopy() {
    navigator.clipboard.writeText(content);
  }

  return (
    <div className="flex flex-col items-start w-full mb-4 animate-fadeIn">
      <div className="flex items-start gap-3 w-full">
        {/* Khối Avatar AI */}
        <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center shrink-0 mt-2 shadow-sm border border-blue-100">
          <img src={bot_like} alt="AI Bot" className="w-7 h-7" />
        </div>

        {/* Nội dung Render Markdown */}
        <div className="flex-1 overflow-hidden pt-1 pr-[20px]">
          <MarkdownRender content={content} />
        </div>
      </div>

      {/* Thanh Option Bar (Copy) căn lề thụt vào khớp với chữ */}
      <div className="flex justify-start pl-[52px]">
        <button
          onClick={handleCopy}
          className="rounded hover:bg-gray-100 transition-colors"
          title="Copy answer"
        >
          <img
            src={icon_copy}
            alt="Copy"
            className="w-[18px] h-[18px] opacity-40 hover:opacity-100"
          />
        </button>
      </div>
    </div>
  );
}
