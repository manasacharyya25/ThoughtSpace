"use client";

import Link from "next/link";
import { Mail } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { PendingResponseCard } from "@/components/inbox/pending-response-card";
import { useInbox } from "@/context/inbox-context";
import { useTrial } from "@/context/trial-context";
import { useUser } from "@/hooks/use-user";
import { env } from "@/lib/env";
import { INBOX_CHAT_GATE_MESSAGE } from "@/lib/trial/constants";
import { consumeInboxChatGateFlag } from "@/lib/trial/storage";
import { formatRelativeTime } from "@/lib/time";
import { cn } from "@/lib/utils";

type InboxTab = "new" | "connections";

function InboxAvatar({
  initial,
  unread,
}: {
  initial: string;
  unread?: boolean;
}) {
  return (
    <div className="relative shrink-0">
      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2F9CFA] text-xs font-bold text-white">
        {initial}
      </div>
      {unread && (
        <span
          className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-white"
          aria-label="Unread"
        />
      )}
    </div>
  );
}

export function InboxList() {
  const {
    pending,
    pendingLoading,
    pendingError,
    conversations,
    conversationsLoading,
    conversationsError,
    openConversation,
    isConversationUnread,
    isPendingUnread,
    markConversationUnread,
  } = useInbox();
  const {
    isGuest,
    showInboxChatGate,
    promptInboxChatSignup,
    dismissInboxChatGate,
  } = useTrial();
  const { user } = useUser();

  const unreadPendingCount = useMemo(
    () => pending.filter((item) => isPendingUnread(item.id)).length,
    [pending, isPendingUnread]
  );

  const unreadConversationCount = useMemo(
    () => conversations.filter((c) => isConversationUnread(c.id)).length,
    [conversations, isConversationUnread]
  );

  const [activeTab, setActiveTab] = useState<InboxTab>("connections");
  const [tabInitialized, setTabInitialized] = useState(false);

  useEffect(() => {
    if (tabInitialized || pendingLoading) return;
    setActiveTab(pending.length > 0 ? "new" : "connections");
    setTabInitialized(true);
  }, [pending.length, pendingLoading, tabInitialized]);

  useEffect(() => {
    if (!user?.id) return;
    if (consumeInboxChatGateFlag(user.id)) {
      promptInboxChatSignup();
    }
  }, [promptInboxChatSignup, user?.id]);

  const handleConversationClick = (conversationId: string) => {
    if (isGuest) {
      promptInboxChatSignup();
      return;
    }
    openConversation(conversationId);
  };

  const loading = pendingLoading || conversationsLoading;
  const hasError = pendingError || conversationsError;

  return (
    <div className="whisper-feed relative mx-auto min-h-[70vh] w-full max-w-2xl space-y-6 py-2 sm:py-4">
      <header className="space-y-1 text-center sm:text-left">
        <h1 className="text-[clamp(1.35rem,3vw,2rem)] font-extrabold leading-[1.08] tracking-[-1px] text-[#1C1D1E]">
          Inbox
        </h1>
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#1C1D1E]/45 sm:text-xs">
          Private, one-to-one
        </p>
      </header>

      {showInboxChatGate ? (
        <div className="flex items-center justify-between gap-3 rounded-[20px] border border-[#2F9CFA]/20 bg-[#EBF5FF] px-4 py-3">
          <p className="text-sm font-semibold text-[#1C1D1E]">
            {INBOX_CHAT_GATE_MESSAGE}
          </p>
          <div className="flex shrink-0 items-center gap-2">
            <Link
              href="/login?next=/inbox"
              className="rounded-2xl bg-[#1C1D1E] px-3 py-1.5 text-[10px] font-bold uppercase text-white transition-colors hover:bg-[#2F9CFA]"
            >
              Sign up
            </Link>
            <button
              type="button"
              onClick={dismissInboxChatGate}
              className="text-[10px] font-semibold text-[#1C1D1E]/45 transition-colors hover:text-[#1C1D1E]"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex w-full gap-2 border-b border-[#1C1D1E]/[0.06] pb-4 sm:gap-4">
        <button
          type="button"
          onClick={() => setActiveTab("new")}
          className={cn(
            "relative min-w-0 flex-1 py-2.5 text-center text-[10px] font-bold uppercase tracking-wide transition-all focus:outline-none sm:py-3 sm:text-xs sm:tracking-wider",
            activeTab === "new"
              ? "border-b-2 border-[#2F9CFA] text-[#1C1D1E]"
              : "text-[#1C1D1E]/45 hover:text-[#1C1D1E]/70"
          )}
        >
          New responses
          {unreadPendingCount > 0 && (
            <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#2F9CFA] px-1 text-[9px] font-bold text-white">
              {unreadPendingCount}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("connections")}
          className={cn(
            "relative min-w-0 flex-1 py-2.5 text-center text-[10px] font-bold uppercase tracking-wide transition-all focus:outline-none sm:py-3 sm:text-xs sm:tracking-wider",
            activeTab === "connections"
              ? "border-b-2 border-[#2F9CFA] text-[#1C1D1E]"
              : "text-[#1C1D1E]/45 hover:text-[#1C1D1E]/70"
          )}
        >
          Connections
          {unreadConversationCount > 0 && (
            <span className="ml-1.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[9px] font-bold text-white">
              {unreadConversationCount}
            </span>
          )}
        </button>
      </div>

      {loading ? (
        <p className="text-xs font-medium text-landing-muted">Loading inbox…</p>
      ) : hasError ? (
        <p className="text-xs font-medium text-red-500">
          {pendingError ?? conversationsError}
        </p>
      ) : activeTab === "new" ? (
        pending.length === 0 ? (
          <div className="whisper-card rounded-[20px] border border-dashed border-[#1C1D1E]/10 py-12 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-landing-muted">
              No new responses waiting.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {pending.map((response) => (
              <PendingResponseCard key={response.id} response={response} />
            ))}
          </div>
        )
      ) : conversations.length === 0 ? (
        <div className="whisper-card rounded-[20px] border border-dashed border-[#1C1D1E]/10 py-12 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-landing-muted">
            No active connections yet.
          </p>
          <p className="mt-2 text-[10px] font-medium text-[#1C1D1E]/45">
            Accept a response from the New tab to start chatting.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((conversation) => {
            const lastMessage =
              conversation.messages[conversation.messages.length - 1];
            const preview = lastMessage?.content ?? conversation.startedFrom;
            const unread = isConversationUnread(conversation.id);

            return (
              <div
                key={conversation.id}
                className={cn(
                  "whisper-card flex items-center gap-2 rounded-[20px] p-4",
                  unread && "border-[#2F9CFA]/30"
                )}
              >
                <button
                  type="button"
                  onClick={() => handleConversationClick(conversation.id)}
                  className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left"
                >
                  <InboxAvatar
                    initial={conversation.partnerInitial}
                    unread={unread}
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 text-sm font-medium italic leading-relaxed text-[#1C1D1E]/75">
                      &ldquo;{preview}&rdquo;
                    </p>
                    <span className="mt-1 block text-[10px] font-medium text-[#1C1D1E]/45">
                      {formatRelativeTime(conversation.lastMessageAt)}
                    </span>
                  </div>
                </button>
                {!unread ? (
                  <button
                    type="button"
                    onClick={() => markConversationUnread(conversation.id)}
                    className="shrink-0 rounded-xl p-2 text-[#1C1D1E]/35 transition-colors hover:bg-[#1C1D1E]/5 hover:text-[#1C1D1E]/70"
                    title="Mark unread"
                    aria-label="Mark unread"
                  >
                    <Mail className="h-4 w-4" />
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      <footer className="hidden pt-2 text-center text-[10px] font-medium uppercase text-[#1C1D1E]/35 sm:block">
        © {new Date().getFullYear()} {env.NEXT_PUBLIC_APP_NAME}. Secure &amp;
        Anonymous.
      </footer>
    </div>
  );
}
