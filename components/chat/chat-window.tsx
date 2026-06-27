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
    <>
      <ChatHeader conversation={conversation} onBack={onBack} />
      <ChatMessages conversation={conversation} />
      <ChatComposer
        onSend={(content) => {
          sendMessage(conversationId, content);
        }}
      />
    </>
  );
}
