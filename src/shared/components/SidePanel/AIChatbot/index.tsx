// Vị trí: src/shared/components/SidePanel/AIChatbot/index.tsx
import { useEffect, useRef } from 'react';
import { useAuthContext_v2 } from '../../../context/hooks/useAuthContext_v2';
import { useEditorStore } from '../../../store/useEditorStore';
import { useChat } from './hooks/useChat';
import { UserMessage } from './components/UserMessage';
import { AIMessage } from './components/AIMessage';
import { ChatInput } from './components/ChatInput';
import { useAIChatStore } from '@/shared/store/useAIChatStore';

// Import con bot mascot (Đảm bảo đường dẫn khớp dự án của bạn)
import bot_like from '@Assets/Mascots/bot_like.svg';

import { LoadingSpinner } from '../../Loading/LoadingSpinner';

interface AIChatbotProps {
  lessonId?: string;
  exerciseId?: string;
  isCompact?: boolean; // MỚI: Biết xem có đang bị video đè ở trên không
}

export function AIChatbot({ lessonId = '', exerciseId = '', isCompact = false }: AIChatbotProps) {
  const { user } = useAuthContext_v2();

  // Lấy source code. Hiện tại store chỉ lưu initialCode,
  // nếu muốn code realtime thì sau này bạn cần setup dispatch từ CodeEditor lên Store nhé.
  const srcCode = useEditorStore((state) => state.initialCode);

  // LOGIC CHIỀU CAO: Nếu bị thu gọn (isCompact = true) thì dùng 4.5 dòng (114px), ngược lại 10.5 dòng (250px)
  const inputHeightClass = isCompact ? 'max-h-[114px]' : 'max-h-[250px]';

  // Theo spec backend: ID truyền vào API /conversations/:id chính là ID của lesson (hoặc exercise)
  const conversationId = lessonId || exerciseId;

  const { messages, isLoadingHistory, isSending, sendMessage } = useChat(
    conversationId,
    user?._id,
    lessonId,
    exerciseId,
  );

  const { setChatMounted, externalQuery, setExternalQuery, setAILoading } = useAIChatStore();

  // Luồng 1: Báo hiệu cho Popover biết Chatbot đang mở
  useEffect(() => {
    setChatMounted(true);
    return () => setChatMounted(false);
  }, [setChatMounted]);

  // Luồng 2: Đồng bộ trạng thái AI bận lên Store
  useEffect(() => {
    setAILoading(isSending);
  }, [isSending, setAILoading]);

  // Luồng 3: Nhận Text bôi đen và Bắn thẳng vào hệ thống nhắn tin
  useEffect(() => {
    if (externalQuery) {
      sendMessage(externalQuery, srcCode);
      setExternalQuery(null); // Bắn xong thì dọn rác ngay lập tức
    }
  }, [externalQuery, sendMessage, srcCode, setExternalQuery]);

  // LOGIC: TỰ ĐỘNG CUỘN XUỐNG ĐÁY KHI CÓ TIN NHẮN MỚI
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isSending]);

  if (!conversationId) return null;

  return (
    // 1. SỬA THẺ NGOÀI CÙNG: Bỏ cái [scrollbar-gutter:stable] đi, vì nó đang tự tạo khoảng trắng đẩy mọi thứ lùi lại
    <div className="flex flex-col h-full overflow-hidden bg-white">
      {/* 1. KHU VỰC HIỂN THỊ TIN NHẮN */}
      <div
        ref={scrollRef}
        // 2. SỬA THẺ CHỨA TIN NHẮN: Đổi p-3 thành pl-3 pr-0 py-3 (Bỏ đệm phải để thanh cuộn dính sát viền)
        className="flex-1 overflow-y-auto custom-scrollbar pl-2 pr-2 py-3 flex flex-col scroll-smooth"
      >
        {/* Lời chào mặc định (Chỉ hiện khi KHÔNG tải lịch sử và CHƯA CÓ tin nhắn nào) */}
        {!isLoadingHistory && messages.length === 0 && (
          // SENIOR FIX: Xóa mb-6 mt-4, thay bằng my-auto để nó tự đẩy ra chính giữa trục Y
          <div className="flex flex-col justify-center items-center text-center my-auto animate-fadeIn">
            <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3 shadow-sm border border-blue-100">
              <img src={bot_like} alt="AI Mascot" className="w-8 h-8" />
            </div>
            <p className="text-gray-400 italic text-sm px-6">
              If you have any question, just ask me, I can help!
            </p>
          </div>
        )}

        {/* Trạng thái tải lịch sử */}
        {isLoadingHistory && (
          <div className="text-center text-gray-400 text-sm animate-pulse mb-4">
            Loading chat history...
          </div>
        )}

        {/* Duyệt mảng in ra tin nhắn */}
        {messages.map((msg) =>
          msg.role === 'user' ? (
            <UserMessage key={msg._id} content={msg.content} />
          ) : (
            <AIMessage key={msg._id} content={msg.content} />
          ),
        )}

        {/* Animation AI đang gõ chữ (Hiện khi isSending = true) */}
        {isSending && (
          // 2. SENIOR FIX: Dùng flex justify-start để neo nó sang trái giống hệt bong bóng chat
          <div className="mb-4 pl-3 flex justify-start opacity-80 animate-fadeIn">
            <LoadingSpinner
              text="Cận is thinking for answer..."
              iconSize="w-4 h-4"
              textColor="text-[#1E3A8A] italic"
            />
          </div>
        )}
      </div>

      {/* 2. KHU VỰC NHẬP TIN NHẮN (Ghim chặt ở đáy) */}
      <div className="pr-2 shrink-0 shadow-[0px_-5px_10px_5px_rgba(255,255,255,1)] z-10">
        <ChatInput
          onSend={(text) => sendMessage(text, srcCode)}
          isLoading={isSending}
          maxHeightClass={inputHeightClass} // MỚI: Truyền xuống cho con
        />
      </div>
    </div>
  );
}
