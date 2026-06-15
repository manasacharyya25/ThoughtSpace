import { cn } from "@/lib/utils";
import type { InboxMessage } from "@/types/inbox";

interface ChatMessageBubbleProps {
  message: InboxMessage;
}

function formatTimestamp(date: string) {
  const d = new Date(date);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();

  if (isToday) {
    return new Intl.DateTimeFormat("en", {
      hour: "numeric",
      minute: "2-digit",
    }).format(d);
  }

  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(d);
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  return (
    <div
      className={cn(
        "inbox-chat-bubble-row",
        message.isFromMe
          ? "inbox-chat-bubble-row--self"
          : "inbox-chat-bubble-row--other"
      )}
    >
      <div
        className={cn(
          "inbox-chat-bubble",
          message.isFromMe
            ? "inbox-chat-bubble--self"
            : "inbox-chat-bubble--other"
        )}
      >
        {message.content}
      </div>
      <span className="inbox-chat-bubble-time">
        {formatTimestamp(message.createdAt)}
      </span>
    </div>
  );
}
