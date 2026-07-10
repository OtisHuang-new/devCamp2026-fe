export interface Get_ConversationRespondParam {
  user_id: string;
}

export interface Get_ConversationRespond {
  _id: string;
  role: 'user' | 'AI';
  content: string;
  createdAt: string;
}

export interface Post_ConversationRequest {
  user_id: string;
  lesson_id: string;
  exercise_id: string;
  question: string;
  src_code: string; // đang tryền initial code chứ không phải code hiện tại của user
}

export interface Post_ConversationRespond {
  _id: string;
  role: 'user' | 'AI';
  content: string;
  createdAt: string;
}
