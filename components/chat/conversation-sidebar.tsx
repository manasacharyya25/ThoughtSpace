"use client";

import { useInbox } from "@/context/inbox-context";
import { staggerStyle } from "@/lib/motion";
import { formatRelativeTime } from "@/lib/time";
import { cn } from "@/lib/utils";

export function ConversationSidebar() {
  const {
    pending,
    conversations,
    activeId,
    setActiveId,
    acceptPending,
  } = useInbox();

  return (
    <aside className="flex h-full flex-col border-r border-border bg-surface/20">
      <div className="border-b border-border px-4 py-4">
        <h2 className="text-lg font-semibold tracking-tight text-heading">
          Inbox
        </h2>
        <p className="mt-0.5 text-[12px] text-muted-foreground/60">
          Private, one-to-one
        </p>
      </div>

      <div className="flex-1 overflow-y-auto">
        {pending.length > 0 && (
          <div className="border-b border-border p-3">
            <p className="mb-2 px-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground/50">
              Pending
            </p>
            <div className="space-y-2">
              {pending.map((item, index) => (
                <div
                  key={item.id}
                  className="fade-in-up rounded-xl border border-border bg-muted/30 p-3"
                  style={staggerStyle(index)}
                >
                  <div className="flex items-center gap-2">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-border/40 bg-surface text-[10px] font-medium text-muted-foreground">
                      {item.fromInitial}
                    </div>
                    <span className="text-[10px] text-muted-foreground/50">
                      {formatRelativeTime(item.receivedAt)}
                    </span>
                  </div>
                  <p className="mt-2 line-clamp-2 text-[12px] leading-relaxed text-foreground/70">
                    {item.responsePreview}
                  </p>
                  <button
                    type="button"
                    onClick={() => acceptPending(item.id)}
                    className="soft-interactive mt-2.5 w-full rounded-lg border border-border py-1.5 text-[11px] font-medium text-foreground hover:border-white/10 hover:bg-muted/40"
                  >
                    Accept
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="p-3">
          <p className="mb-2 px-1 text-[10px] font-medium uppercase tracking-widest text-muted-foreground/50">
            Conversations
          </p>
          {conversations.length === 0 ? (
            <p className="px-1 py-6 text-center text-[12px] text-muted-foreground/50">
              No conversations yet
            </p>
          ) : (
            <div className="space-y-1">
              {conversations.map((conv, index) => {
                const lastMsg = conv.messages[conv.messages.length - 1];
                const isActive = activeId === conv.id;

                return (
                  <button
                    key={conv.id}
                    type="button"
                    onClick={() => setActiveId(conv.id)}
                    className={cn(
                      "fade-in-up soft-interactive flex w-full items-start gap-3 rounded-xl border border-transparent px-3 py-3 text-left",
                      isActive
                        ? "nav-item-active border-border"
                        : "hover:border-border hover:bg-muted/30"
                    )}
                    style={staggerStyle(index)}
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/40 bg-muted/20 text-xs font-medium text-muted-foreground">
                      {conv.partnerInitial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[11px] text-muted-foreground/50">
                          {formatRelativeTime(conv.lastMessageAt)}
                        </span>
                      </div>
                      <p className="mt-1 truncate text-[13px] text-foreground/80">
                        {lastMsg?.content}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
