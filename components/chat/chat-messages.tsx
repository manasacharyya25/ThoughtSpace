"use client";

import { useEffect, useRef } from "react";
import type { ActiveConversation } from "@/types/inbox";
import { ChatMessageBubble } from "./chat-message-bubble";

interface ChatMessagesProps {
  conversation: ActiveConversation;
}

export function ChatMessages({ conversation }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation.messages.length]);

  return (
    <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-5">
      <div className="mx-auto max-w-2xl space-y-4">
        <div className="mb-6 text-center">
          <span className="inline-block max-w-sm rounded-full border border-border bg-muted/20 px-3 py-1.5 text-[10px] leading-relaxed text-muted-foreground/60">
            Started from: &ldquo;{conversation.startedFrom}&rdquo;
          </span>
        </div>

        {conversation.messages.map((message) => (
          <ChatMessageBubble key={message.id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
