export interface PendingResponse {
  id: string;
  fromInitial: string;
  thoughtExcerpt: string;
  responsePreview: string;
  fullResponse: string;
  category: string;
  receivedAt: string;
}

export interface InboxMessage {
  id: string;
  content: string;
  isFromMe: boolean;
  createdAt: string;
}

export interface ActiveConversation {
  id: string;
  partnerInitial: string;
  startedFrom: string;
  messages: InboxMessage[];
  lastMessageAt: string;
}
