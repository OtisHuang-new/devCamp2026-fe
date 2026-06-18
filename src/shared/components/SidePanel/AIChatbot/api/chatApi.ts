import axiosClient from '@/shared/api/axiosClient';
import type {
  Get_ConversationRespond,
  Get_ConversationRespondParam,
  Post_ConversationRequest,
  Post_ConversationRespond,
} from '../types/chatTypes';

export const chatApi = {
  // Thêm tham số thứ 3 (optional) là signal
  getConversation: async (
    conversation_id: string,
    params: Get_ConversationRespondParam,
    signal?: AbortSignal, // <-- MỚI
  ): Promise<Get_ConversationRespond[]> => {
    const respond = await axiosClient.get<Get_ConversationRespond[], Get_ConversationRespond[]>(
      `/conversations/${conversation_id}`,
      {
        params: params,
        signal: signal, // <-- TRUYỀN XUỐNG AXIOS
      },
    );
    return respond;
  },

  postConversation: async (
    conversation_id: string,
    payload: Post_ConversationRequest,
  ): Promise<Post_ConversationRespond> => {
    const respond = await axiosClient.post<Post_ConversationRespond, Post_ConversationRespond>(
      `/conversations/${conversation_id}`,
      payload,
    );
    return respond;
  },
};
