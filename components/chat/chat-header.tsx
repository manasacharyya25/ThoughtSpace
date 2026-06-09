"use client";

import type { ActiveConversation } from "@/types/inbox";

interface ChatHeaderProps {
  conversation: ActiveConversation;
  onBack?: () => void;
}

export function ChatHeader({ conversation, onBack }: ChatHeaderProps) {
  return (
    <header className="flex items-center gap-3 border-b border-border/40 px-4 py-3 sm:px-5">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to conversations"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground md:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
      )}

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/40 bg-muted/30 text-xs font-medium text-muted-foreground">
        {conversation.partnerInitial}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-foreground/90">
          Private conversation
        </p>
        <p className="truncate text-[11px] italic text-muted-foreground/60">
          &ldquo;{conversation.startedFrom}&rdquo;
        </p>
      </div>
    </header>
  );
}
