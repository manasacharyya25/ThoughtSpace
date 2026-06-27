"use client";

import { useEffect, useRef } from "react";
import type { ActiveConversation } from "@/types/inbox";
import { ChatMessageBubble } from "./chat-message-bubble";

interface ChatMessagesProps {
  conversation: ActiveConversation;
}

export function ChatMessages({ conversation }: ChatMessagesProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [conversation.messages.length]);

  return (
    <div ref={scrollRef} className="inbox-chat-messages">
      <div className="inbox-chat-thread">
        <div className="inbox-chat-origin">
          <span className="inbox-chat-origin-pill">
            Started from: &ldquo;{conversation.startedFrom}&rdquo;
          </span>
        </div>

        {conversation.messages.map((message) => (
          <ChatMessageBubble key={message.id} message={message} />
        ))}
      </div>
    </div>
  );
}
