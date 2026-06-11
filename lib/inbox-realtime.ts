import type { ActiveConversation, InboxMessage } from "@/types/inbox";

export function reorderConversations(
  conversations: ActiveConversation[]
): ActiveConversation[] {
  return [...conversations].sort(
    (a, b) =>
      new Date(b.lastMessageAt).getTime() - new Date(a.lastMessageAt).getTime()
  );
}

export function applyIncomingMessage(
  conversations: ActiveConversation[],
  conversationId: string,
  message: InboxMessage
): ActiveConversation[] | null {
  const index = conversations.findIndex((c) => c.id === conversationId);
  if (index === -1) return null;

  const conv = conversations[index];
  const hasMessage = conv.messages.some((m) => m.id === message.id);

  const updatedConv: ActiveConversation = {
    ...conv,
    lastMessageAt: message.createdAt,
    messages: hasMessage ? conv.messages : [...conv.messages, message],
  };

  const next = [...conversations];
  next[index] = updatedConv;
  return reorderConversations(next);
}
