"use client";

import { formatRelativeTime } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { ActiveConversation } from "@/types/inbox";
import { ConversationThread } from "./conversation-thread";

interface ConversationCardProps {
  conversation: ActiveConversation;
  isOpen: boolean;
  onToggle: () => void;
}

export function ConversationCard({
  conversation,
  isOpen,
  onToggle,
}: ConversationCardProps) {
  const lastMessage =
    conversation.messages[conversation.messages.length - 1];

  return (
    <article
      className={cn(
        "inbox-card transition-all duration-300",
        isOpen && "inbox-card-expanded"
      )}
    >
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-start gap-3 text-left"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/40 bg-muted/20 text-xs font-medium text-muted-foreground">
          {conversation.partnerInitial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-muted-foreground/60">
              {formatRelativeTime(conversation.lastMessageAt)}
            </span>
            <span
              className={cn(
                "text-muted-foreground/40 transition-transform duration-200",
                isOpen && "rotate-180"
              )}
              aria-hidden="true"
            >
              ↓
            </span>
          </div>
          <p className="mt-2 text-[12px] italic leading-relaxed text-muted-foreground/50">
            Started from: &ldquo;{conversation.startedFrom}&rdquo;
          </p>
          {!isOpen && (
            <p className="mt-2 truncate text-[14px] text-foreground/70">
              {lastMessage?.content}
            </p>
          )}
        </div>
      </button>

      {isOpen && (
        <div className="mt-4 border-t border-border/30 pt-4">
          <ConversationThread conversation={conversation} />
        </div>
      )}
    </article>
  );
}
