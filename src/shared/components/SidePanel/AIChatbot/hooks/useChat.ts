// Vị trí: src/shared/components/SidePanel/AIChatbot/hooks/useChat.ts

import { useState, useEffect } from 'react';
import { chatApi } from '../api/chatApi';
import type { Get_ConversationRespond } from '../types/chatTypes';

export function useChat(
  conversation_id: string,
  user_id: string | undefined,
  lesson_id: string,
  exercise_id: string,
) {
  // KHO CHỨA STATE
  const [messages, setMessages] = useState<Get_ConversationRespond[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [isSending, setIsSending] = useState(false);

  // ==========================================
  // LUỒNG 1: TỰ ĐỘNG TẢI LỊCH SỬ CHAT LÚC MỞ PANEL
  // ==========================================
  useEffect(() => {
    if (!conversation_id || !user_id) return;

    const controller = new AbortController();

    async function fetchHistory() {
      setIsLoadingHistory(true);

      try {
        // Truyền signal xuống cho API để có thể hủy
        const data = await chatApi.getConversation(
          conversation_id,
          { user_id: user_id! },
          controller.signal,
        );

        // SENIOR FIX: Backend trả về [Mới -> Cũ]. UI cần [Cũ -> Mới].
        // Dùng [...data] để tạo bản sao an toàn, sau đó .reverse() để đảo ngược mảng.
        // Cuối cùng mới lưu vào State.
        setMessages([...data].reverse());
      } catch (error: unknown) {
        // 2. Kiểm tra xem error có đúng là 1 Object Error không trước khi gọi .name
        if (error instanceof Error && error.name === 'CanceledError') {
          console.log('Đã hủy tải lịch sử do đóng Panel.');
        } else {
          console.log('useChat lỗi tải lịch sử:', error);
        }
      } finally {
        setIsLoadingHistory(false);
      }
    }

    fetchHistory();

    return () => {
      // Khi đóng Panel hoặc đổi cuộc hội thoại -> Hủy API ngay lập tức
      controller.abort();
    };
  }, [conversation_id, user_id]);

  // ==========================================
  // LUỒNG 2: GỬI TIN NHẮN (OPTIMISTIC UI)
  // ==========================================
  async function sendMessage(question: string, src_code: string = '') {
    if (!user_id) return;
    if (!question.trim()) return;

    setIsSending(true);

    // BƯỚC A: Tạo 1 object tin nhắn giả cho User
    // Dùng Date.now() để chế ra 1 cái ID tạm thời (cực kỳ quan trọng để lát nữa dễ xóa)
    const fakeMessageId = Date.now().toString();
    const fakeUserMessage: Get_ConversationRespond = {
      _id: fakeMessageId,
      role: 'user',
      content: question,
      createdAt: new Date().toISOString(),
    };

    // BƯỚC B: Nhét tin nhắn giả vào UI ngay lập tức
    setMessages((prevMessages) => [...prevMessages, fakeUserMessage]);

    try {
      // BƯỚC C: Gọi API với đầy đủ payload
      const aiResponse = await chatApi.postConversation(conversation_id, {
        user_id: user_id,
        lesson_id: lesson_id,
        exercise_id: exercise_id,
        question: question,
        src_code: src_code,
      });

      // BƯỚC D: Nhận kết quả AI trả về, giữ nguyên tin nhắn giả của User, nhét thêm tin nhắn AI vào
      setMessages((prevMessages) => [...prevMessages, aiResponse]);
    } catch (error) {
      // BƯỚC E (QUAN TRỌNG NHẤT): Nếu rớt mạng hoặc API lỗi
      console.error('Lỗi khi gửi tin nhắn:', error);
      alert('Lỗi mạng! Không thể gửi tin nhắn. Vui lòng thử lại.');

      // ROLLBACK: Xóa cái tin nhắn giả lúc nãy ra khỏi màn hình
      // Lọc ra giữ lại những tin nhắn mà ID KHÁC VỚI fakeMessageId
      setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== fakeMessageId));
    } finally {
      // BƯỚC F: Tắt trạng thái loading
      setIsSending(false);
    }
  }

  return {
    messages,
    isLoadingHistory,
    isSending,
    sendMessage,
  };
}
