"use client";

import { useInbox } from "@/context/inbox-context";
import { ChatWindow } from "./chat-window";
import { InboxList } from "./inbox-list";

export function ChatLayout() {
  const { activeId, closeConversation } = useInbox();

  if (activeId) {
    return (
      <div className="mx-auto flex h-[100svh] max-w-2xl flex-col overflow-hidden bg-background">
        <ChatWindow onBack={closeConversation} />
      </div>
    );
  }

  return <InboxList />;
}
