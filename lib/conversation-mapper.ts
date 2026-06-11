import type { ActiveConversation, InboxMessage } from "@/types/inbox";
import type { ConversationRow, MessageRow } from "@/types/conversation";

function truncateText(text: string, maxLen: number): string {
  const trimmed = text.trim();
  if (trimmed.length <= maxLen) return trimmed;
  return `${trimmed.slice(0, maxLen)}…`;
}

function usernameInitial(username: string | null | undefined): string {
  const letter = username?.trim().charAt(0);
  return letter ? letter.toUpperCase() : "?";
}

export function mapInboxMessage(
  row: MessageRow,
  currentUserId: string
): InboxMessage {
  return {
    id: row.id,
    content: row.content,
    isFromMe: row.sender_id === currentUserId,
    createdAt: row.created_at,
  };
}

export function mapActiveConversation(
  row: ConversationRow,
  postContent: string,
  authorUsername: string,
  responderUsername: string,
  messages: MessageRow[],
  currentUserId: string
): ActiveConversation {
  const partnerUsername =
    row.author_id === currentUserId ? responderUsername : authorUsername;

  const sortedMessages = [...messages].sort(
    (a, b) =>
      new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  return {
    id: row.id,
    partnerInitial: usernameInitial(partnerUsername),
    startedFrom: truncateText(postContent, 80),
    lastMessageAt: row.last_message_at,
    messages: sortedMessages.map((message) =>
      mapInboxMessage(message, currentUserId)
    ),
  };
}
