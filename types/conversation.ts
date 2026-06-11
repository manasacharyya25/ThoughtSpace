export interface ConversationRow {
  id: string;
  response_id: string;
  post_id: string;
  author_id: string;
  responder_id: string;
  created_at: string;
  last_message_at: string;
}

export interface MessageRow {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}
