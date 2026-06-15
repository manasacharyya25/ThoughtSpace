"use client";

import { useInbox } from "@/context/inbox-context";
import { env } from "@/lib/env";
import { formatRelativeTime } from "@/lib/time";
import { cn } from "@/lib/utils";

function InboxAvatar({
  initial,
  unread,
}: {
  initial: string;
  unread?: boolean;
}) {
  return (
    <div className="relative shrink-0">
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-landing-border bg-gray-900 font-landing-mono text-xs text-landing-muted">
        {initial}
      </div>
      {unread && (
        <span
          className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-landing-bg"
          aria-label="Unread"
        />
      )}
    </div>
  );
}

export function InboxList() {
  const {
    conversations,
    conversationsLoading,
    conversationsError,
    openConversation,
    isConversationUnread,
  } = useInbox();

  const isEmpty = !conversationsLoading && conversations.length === 0;

  return (
    <div className="whisper-feed mx-auto w-full max-w-2xl space-y-6">
      <header className="space-y-1">
        <h1 className="font-landing-serif text-3xl text-white sm:text-4xl">
          Inbox
        </h1>
        <p className="font-landing-mono text-[10px] uppercase tracking-widest text-landing-muted sm:text-xs">
          Private, one-to-one
        </p>
      </header>

      {conversationsLoading ? (
        <p className="font-landing-mono text-xs text-landing-muted">
          Loading inbox…
        </p>
      ) : conversationsError ? (
        <p className="font-landing-mono text-xs text-red-400">
          {conversationsError}
        </p>
      ) : isEmpty ? (
        <div className="rounded-2xl border border-dashed border-landing-border py-12 text-center">
          <p className="font-landing-mono text-xs uppercase tracking-widest text-landing-muted">
            No active connections found.
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
              <button
                key={conversation.id}
                type="button"
                onClick={() => openConversation(conversation.id)}
                className={cn(
                  "whisper-card flex w-full cursor-pointer items-center gap-3 rounded-xl p-4 text-left",
                  unread && "border-landing-gold/40"
                )}
              >
                <InboxAvatar
                  initial={conversation.partnerInitial}
                  unread={unread}
                />
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-sm font-light italic text-gray-200">
                    &ldquo;{preview}&rdquo;
                  </p>
                  <span className="mt-1 block font-landing-mono text-[10px] text-gray-600">
                    {formatRelativeTime(conversation.lastMessageAt)}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      <footer className="hidden pt-2 text-center font-landing-mono text-[10px] uppercase text-gray-700 sm:block">
        © {new Date().getFullYear()} {env.NEXT_PUBLIC_APP_NAME}. Secure &amp;
        Anonymous.
      </footer>
    </div>
  );
}
