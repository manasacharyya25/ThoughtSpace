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

  const exitChat = () => {
    setActiveChatId(null);
    setActiveTab("read");
  };

  const showTabs = !activeChatId;

  return (
    <div className="whisper-feed relative mx-auto min-h-[70vh] w-full max-w-2xl py-2 sm:py-4">
      <div className="relative z-10 w-full min-w-0 space-y-6">
        <div className="py-2 text-center">
          <h1 className="text-[clamp(1.35rem,3vw,2rem)] font-extrabold leading-[1.08] tracking-[-1px] text-[#1C1D1E]">
            The Live <span className="text-[#2F9CFA]">Whisper Feed</span>
          </h1>
        </div>

        {showTabs && (
          <div className="mx-auto flex w-full justify-center gap-2 border-b border-[#1C1D1E]/[0.06] pb-4 sm:max-w-md sm:gap-4">
            <button
              type="button"
              onClick={() => switchTab("read")}
              className={cn(
                "min-w-0 flex-1 py-2.5 text-center text-[10px] font-bold uppercase tracking-wide transition-all focus:outline-none sm:py-3 sm:text-xs sm:tracking-wider",
                activeTab === "read"
                  ? "border-b-2 border-[#2F9CFA] text-[#1C1D1E]"
                  : "text-[#1C1D1E]/45 hover:text-[#1C1D1E]/70"
              )}
            >
              Read Shared Whispers
            </button>
            <button
              type="button"
              onClick={() => switchTab("cast")}
              className={cn(
                "min-w-0 flex-1 py-2.5 text-center text-[10px] font-bold uppercase tracking-wide transition-all focus:outline-none sm:py-3 sm:text-xs sm:tracking-wider",
                activeTab === "cast"
                  ? "border-b-2 border-[#2F9CFA] text-[#1C1D1E]"
                  : "text-[#1C1D1E]/45 hover:text-[#1C1D1E]/70"
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
          <WhisperCastView />
        )}
      </div>
    </div>
  );
}
