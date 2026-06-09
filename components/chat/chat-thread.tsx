import type { ChatThread } from "@/types";
import { MessageBubble } from "./message-bubble";

interface ChatThreadViewProps {
  thread: ChatThread;
  currentUserId: string;
}

export function ChatThreadView({ thread, currentUserId }: ChatThreadViewProps) {
  return (
    <div className="flex flex-col gap-3">
      {thread.messages.map((message) => (
        <MessageBubble
          key={message.id}
          message={message}
          isOwn={message.senderId === currentUserId}
        />
      ))}
    </div>
  );
}
