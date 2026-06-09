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
        "flex",
        message.isFromMe ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] sm:max-w-[70%]",
          message.isFromMe ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-2.5 text-[15px] leading-[1.65]",
            message.isFromMe
              ? "rounded-br-md bg-foreground text-background"
              : "rounded-bl-md border border-border/40 bg-muted/40 text-foreground/90"
          )}
        >
          {message.content}
        </div>
        <p
          className={cn(
            "mt-1 px-1 text-[10px] text-muted-foreground/50",
            message.isFromMe ? "text-right" : "text-left"
          )}
        >
          {formatTimestamp(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
