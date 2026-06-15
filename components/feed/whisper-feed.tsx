"use client";

import { useMemo, useState } from "react";
import { useInbox } from "@/context/inbox-context";
import { usePosts } from "@/context/posts-context";
import { cn } from "@/lib/utils";
import { WhisperActiveChat } from "./whisper-active-chat";
import { WhisperCastView } from "./whisper-cast-view";
import { WhisperReadView } from "./whisper-read-view";

type FeedTab = "read" | "cast";

export function WhisperFeed() {
  const { posts, loading, error } = usePosts();
  const { conversations } = useInbox();
  const [activeTab, setActiveTab] = useState<FeedTab>("read");
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeChatId),
    [conversations, activeChatId]
  );

  const switchTab = (tab: FeedTab) => {
    setActiveTab(tab);
    setActiveChatId(null);
  };

  const openChat = (conversationId: string) => {
    setActiveChatId(conversationId);
  };

  const exitChat = () => {
    setActiveChatId(null);
    setActiveTab("read");
  };

  const showTabs = !activeChatId;

  return (
    <div className="whisper-feed relative mx-auto min-h-[70vh] w-full max-w-3xl px-1 py-4 sm:px-2 sm:py-8">
      <div
        className="whisper-ambient-glow pointer-events-none absolute right-10 top-20 h-96 w-96"
        aria-hidden="true"
      />
      <div
        className="whisper-ambient-glow pointer-events-none absolute bottom-20 left-10 h-96 w-96"
        aria-hidden="true"
      />

      <div className="relative z-10 space-y-8">
        <div className="mb-2 py-4 text-center">
          <h1 className="font-landing-serif text-4xl tracking-tight text-gray-100 sm:text-5xl">
            The Live <span className="italic text-landing-gold">Whisper Feed</span>
          </h1>
        </div>

        {showTabs && (
          <div className="mx-auto flex max-w-md justify-center space-x-4 border-b border-landing-border pb-4">
            <button
              type="button"
              onClick={() => switchTab("read")}
              className={cn(
                "flex-1 py-3 font-landing-mono text-xs uppercase tracking-wider transition-all focus:outline-none",
                activeTab === "read"
                  ? "border-b-2 border-landing-gold text-white"
                  : "text-landing-muted hover:text-gray-200"
              )}
            >
              Read Shared Whispers
            </button>
            <button
              type="button"
              onClick={() => switchTab("cast")}
              className={cn(
                "flex-1 py-3 font-landing-mono text-xs uppercase tracking-wider transition-all focus:outline-none",
                activeTab === "cast"
                  ? "border-b-2 border-landing-gold text-white"
                  : "text-landing-muted hover:text-gray-200"
              )}
            >
              Cast a Whisper
            </button>
          </div>
        )}

        {activeChatId && activeConversation ? (
          <WhisperActiveChat
            conversation={activeConversation}
            onExit={exitChat}
          />
        ) : activeTab === "read" ? (
          <WhisperReadView posts={posts} loading={loading} error={error} />
        ) : (
          <WhisperCastView onAcceptConnection={openChat} />
        )}
      </div>
    </div>
  );
}
