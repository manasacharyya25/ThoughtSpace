"use client";

import { Fragment } from "react";
import { useInbox } from "@/context/inbox-context";
import { PageHeader } from "@/components/layout/page-header";
import { FadeIn } from "@/components/ui/fade-in";
import { VioletSeparator } from "@/components/ui/violet-separator";
import { staggerStyle } from "@/lib/motion";
import { formatRelativeTime } from "@/lib/time";
import { cn } from "@/lib/utils";

function UnreadDot({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-surface",
        className
      )}
      aria-hidden="true"
    />
  );
}

const inboxRowClass =
  "soft-interactive group flex items-start gap-3 px-4 py-4 transition-[background-color] duration-300 ease hover:bg-white/[0.04]";

function Avatar({ initial, showDot }: { initial: string; showDot?: boolean }) {
  return (
    <div className="relative shrink-0">
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted/30 text-xs font-medium text-muted-foreground transition-[border-color,background-color] duration-300 ease group-hover:border-white/10 group-hover:bg-muted/40">
        {initial}
      </div>
      {showDot && <UnreadDot />}
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
    acceptPending,
    isConversationUnread,
    isPendingUnread,
  } = useInbox();

  const isLoading = pendingLoading || conversationsLoading;
  const loadError = pendingError ?? conversationsError;
  const isEmpty =
    !isLoading && pending.length === 0 && conversations.length === 0;

  return (
    <div className="mx-auto w-full max-w-2xl">
      <FadeIn index={0}>
        <PageHeader
          title="Inbox"
          description={
            pending.length > 0
              ? `${pending.length} invite${pending.length === 1 ? "" : "s"} waiting`
              : "Private, one-to-one"
          }
        />
      </FadeIn>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading inbox…</p>
      ) : loadError ? (
        <p className="text-sm text-red-400">{loadError}</p>
      ) : isEmpty ? (
        <FadeIn index={1}>
          <p className="py-12 text-center text-sm text-muted-foreground/60">
            No messages yet. Respond to a thought on your feed to start a
            conversation.
          </p>
        </FadeIn>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border bg-surface/30">
          {pending.map((item, index) => {
            const pendingUnread = isPendingUnread(item.id);

            return (
            <Fragment key={item.id}>
              {index > 0 && <VioletSeparator />}
              <div
                className={cn("fade-in-up", inboxRowClass)}
                style={staggerStyle(index)}
              >
                <Avatar initial={item.fromInitial} showDot={pendingUnread} />
                <div className="min-w-0 flex-1 space-y-1">
                  <p className="line-clamp-2 text-[14px] leading-relaxed text-foreground/80 transition-colors duration-300 group-hover:text-foreground">
                    {item.responsePreview}
                  </p>
                  <p className="text-[11px] text-muted-foreground/50 transition-colors duration-300 group-hover:text-muted-foreground/70">
                    {formatRelativeTime(item.receivedAt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => acceptPending(item.id)}
                  className="soft-interactive mt-0.5 shrink-0 rounded-md border border-border px-2.5 py-1.5 text-[11px] font-medium text-foreground hover:border-white/10 hover:bg-white/[0.04]"
                >
                  Accept
                </button>
              </div>
            </Fragment>
            );
          })}

          {conversations.map((conv, index) => {
            const lastMsg = conv.messages[conv.messages.length - 1];
            const rowIndex = pending.length + index;
            const unread = isConversationUnread(conv.id);
            const showSeparator = pending.length > 0 || index > 0;

            return (
              <Fragment key={conv.id}>
                {showSeparator && <VioletSeparator />}
                <button
                  type="button"
                  onClick={() => openConversation(conv.id)}
                  className={cn(
                    "fade-in-up w-full text-left",
                    inboxRowClass,
                    unread && "bg-muted/10 hover:bg-white/[0.04]"
                  )}
                  style={staggerStyle(rowIndex)}
                >
                  <Avatar initial={conv.partnerInitial} showDot={unread} />
                  <div className="min-w-0 flex-1 space-y-1">
                    <p
                      className={cn(
                        "line-clamp-2 text-[14px] leading-relaxed transition-colors duration-300 group-hover:text-foreground",
                        unread ? "text-foreground" : "text-foreground/75"
                      )}
                    >
                      {lastMsg?.content}
                    </p>
                    <p className="text-[11px] text-muted-foreground/50 transition-colors duration-300 group-hover:text-muted-foreground/70">
                      {formatRelativeTime(conv.lastMessageAt)}
                    </p>
                  </div>
                </button>
              </Fragment>
            );
          })}
        </div>
      )}
    </div>
  );
}
