"use client";

import { useInbox } from "@/context/inbox-context";
import { ChatComposer } from "./chat-composer";
import { ChatHeader } from "./chat-header";
import { ChatMessages } from "./chat-messages";

interface ChatWindowProps {
  onBack?: () => void;
}

export function ChatWindow({ onBack }: ChatWindowProps) {
  const { activeConversation, sendMessage, activeId } = useInbox();

  if (!activeConversation) return null;

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      <ChatHeader conversation={activeConversation} onBack={onBack} />
      <ChatMessages conversation={activeConversation} />
      <ChatComposer
        onSend={(content) => {
          if (activeId) sendMessage(activeId, content);
        }}
      />
    </div>
  );
}
