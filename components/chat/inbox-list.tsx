"use client";

import { useInbox } from "@/context/inbox-context";
import { PageHeader } from "@/components/layout/page-header";
import { FadeIn } from "@/components/ui/fade-in";
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

function Avatar({ initial, showDot }: { initial: string; showDot?: boolean }) {
  return (
    <div className="relative shrink-0">
      <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-muted/30 text-xs font-medium text-muted-foreground">
        {initial}
      </div>
      {showDot && <UnreadDot />}
    </div>
  );
}

export function InboxList() {
  const {
    pending,
    conversations,
    openConversation,
    acceptPending,
    isConversationUnread,
  } = useInbox();

  const isEmpty = pending.length === 0 && conversations.length === 0;

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

      {isEmpty ? (
        <FadeIn index={1}>
          <p className="py-12 text-center text-sm text-muted-foreground/60">
            No messages yet. Respond to a thought on your feed to start a
            conversation.
          </p>
        </FadeIn>
      ) : (
        <div className="divide-y divide-border rounded-2xl border border-border bg-surface/30">
          {pending.map((item, index) => (
            <div
              key={item.id}
              className="fade-in-up flex items-start gap-3 px-4 py-4"
              style={staggerStyle(index)}
            >
              <Avatar initial={item.fromInitial} showDot />
              <div className="min-w-0 flex-1 space-y-1">
                <p className="line-clamp-2 text-[14px] leading-relaxed text-foreground/80">
                  {item.responsePreview}
                </p>
                <p className="text-[11px] text-muted-foreground/50">
                  {formatRelativeTime(item.receivedAt)}
                </p>
              </div>
              <button
                type="button"
                onClick={() => acceptPending(item.id)}
                className="soft-interactive mt-0.5 shrink-0 rounded-md border border-border px-2.5 py-1.5 text-[11px] font-medium text-foreground hover:border-white/10 hover:bg-muted/40"
              >
                Accept
              </button>
            </div>
          ))}

          {conversations.map((conv, index) => {
            const lastMsg = conv.messages[conv.messages.length - 1];
            const rowIndex = pending.length + index;
            const unread = isConversationUnread(conv.id);

            return (
              <button
                key={conv.id}
                type="button"
                onClick={() => openConversation(conv.id)}
                className={cn(
                  "fade-in-up soft-interactive flex w-full items-start gap-3 px-4 py-4 text-left hover:bg-muted/20",
                  unread && "bg-muted/10"
                )}
                style={staggerStyle(rowIndex)}
              >
                <Avatar initial={conv.partnerInitial} showDot={unread} />
                <div className="min-w-0 flex-1 space-y-1">
                  <p
                    className={cn(
                      "line-clamp-2 text-[14px] leading-relaxed",
                      unread ? "text-foreground" : "text-foreground/75"
                    )}
                  >
                    {lastMsg?.content}
                  </p>
                  <p className="text-[11px] text-muted-foreground/50">
                    {formatRelativeTime(conv.lastMessageAt)}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
