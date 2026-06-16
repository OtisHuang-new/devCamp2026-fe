import { useState, useRef, useEffect } from 'react';
import icon_sent_white from '../../assets/icon_sent_white.svg';

interface ChatInputProps {
  onSend: (text: string) => void;
  isLoading?: boolean;
  maxHeightClass?: string;
}

export function ChatInput({
  onSend,
  isLoading,
  maxHeightClass = 'max-h-[250px]', // Mặc định là 10.5 dòng
}: ChatInputProps) {
  const [text, setText] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // SENIOR TRICK: Dùng useEffect để đo lường SAU KHI React đã vẽ text ra màn hình
  useEffect(() => {
    if (textareaRef.current) {
      // 1. Phải reset về 'auto' trước để triệt tiêu chiều cao cũ
      textareaRef.current.style.height = 'auto';
      // 2. Set chiều cao mới dựa vào nội dung thực tế (scrollHeight)
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [text]); // Mỗi lần gõ chữ (thay đổi state text) là tự động chạy

  function handleSend() {
    if (text.trim() && !isLoading) {
      onSend(text.trim());
      setText('');
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Bấm Enter để gửi, Shift+Enter để xuống dòng
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  return (
    // 1. SỬA THẺ CHA: Đổi px-2 thành pl-2 pr-0 (Hủy lề phải để thả cửa cho Textarea chạy sát viền)
    <div className="pl-2 pr-0 py-[6px] border-[1.5px] border-solid border-gray-300 rounded-md">
      <div className="flex flex-col gap-0">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter your message..."
          rows={1}
          // 2. SỬA TEXTAREA: Thêm pr-2 (để chữ không đâm vào thanh cuộn)
          className={`[scrollbar-gutter:stable] w-full pl-1 pr-2 py-1.5 text-sm focus:outline-none resize-none bg-transparent overflow-y-auto custom-scrollbar leading-relaxed ${maxHeightClass}`}
        />

        <button
          onClick={handleSend}
          disabled={!text.trim() || isLoading}
          // 3. SỬA NÚT BẤM: Thêm mr-2 (Lùi lề phải 8px để nó nằm ngay ngắn lại như cũ)
          className={`flex items-center justify-center self-end mr-2 shrink-0 w-8 h-8 rounded-full transition-colors pt-[4px] ${
            !text.trim() || isLoading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-[#1E3A8A] hover:bg-blue-800'
          }`}
        >
          <img src={icon_sent_white} alt="Send" className="w-5 h-5 ml-0.5" />
        </button>
      </div>
    </div>
  );
}
