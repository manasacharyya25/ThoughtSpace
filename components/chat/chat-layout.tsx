"use client";

import { useEffect } from "react";
import { useInbox } from "@/context/inbox-context";
import { cn } from "@/lib/utils";
import { ChatWindow } from "./chat-window";
import { ConversationSidebar } from "./conversation-sidebar";

export function ChatLayout() {
  const { activeId, setActiveId, conversations } = useInbox();
  const showChatOnMobile = !!activeId;

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    if (mq.matches && !activeId && conversations.length > 0) {
      setActiveId(conversations[0].id);
    }
  }, [activeId, conversations, setActiveId]);

  return (
    <div className="mx-auto w-full max-w-5xl">
      <div className="chat-layout soft-surface flex h-[calc(100svh-7rem)] overflow-hidden rounded-2xl bg-surface/30 md:h-[calc(100svh-8rem)]">
        <div
          className={cn(
            "w-full shrink-0 md:block md:w-80 lg:w-96",
            showChatOnMobile ? "hidden" : "block"
          )}
        >
          <ConversationSidebar />
        </div>

        <div
          className={cn(
            "flex min-w-0 flex-1 flex-col",
            showChatOnMobile ? "flex" : "hidden md:flex"
          )}
        >
          <ChatWindow onBack={() => setActiveId(null)} />
        </div>
      </div>
    </div>
  );
}
