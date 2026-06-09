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

  if (!activeConversation) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border border-border/30 bg-muted/20">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="h-5 w-5 text-muted-foreground/40"
            aria-hidden="true"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <p className="mt-4 text-sm text-muted-foreground/60">
          Select a conversation or accept a pending response
        </p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-1 flex-col">
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
