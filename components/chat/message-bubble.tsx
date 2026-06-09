import { cn } from "@/lib/utils";
import type { ChatMessage } from "@/types";

interface MessageBubbleProps {
  message: ChatMessage;
  isOwn: boolean;
}

function formatTime(date: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export function MessageBubble({ message, isOwn }: MessageBubbleProps) {
  return (
    <div
      className={cn("flex", isOwn ? "justify-end" : "justify-start")}
    >
      <div
        className={cn(
          "max-w-[75%] rounded-lg border px-3 py-2 text-sm",
          isOwn
            ? "border-border bg-muted text-foreground"
            : "border-border bg-surface text-foreground"
        )}
      >
        <p>{message.content}</p>
        <p className="mt-1 text-right text-[10px] text-muted-foreground">
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
