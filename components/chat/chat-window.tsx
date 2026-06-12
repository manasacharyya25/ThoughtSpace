"use client";

import type { ActiveConversation } from "@/types/inbox";
import { useInbox } from "@/context/inbox-context";
import { ChatComposer } from "./chat-composer";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";

interface ChatWindowProps {
  conversation: ActiveConversation;
  conversationId: string;
  onBack?: () => void;
}

export function ChatWindow({
  conversation,
  conversationId,
  onBack,
}: ChatWindowProps) {
  const { sendMessage } = useInbox();

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <ChatHeader conversation={conversation} onBack={onBack} />
      <ChatMessages conversation={conversation} />
      <ChatComposer
        onSend={(content) => {
          sendMessage(conversationId, content);
        }}
      />
    </div>
  );
}
