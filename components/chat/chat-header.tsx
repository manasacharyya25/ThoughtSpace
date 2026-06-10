"use client";

import type { ActiveConversation } from "@/types/inbox";

interface ChatHeaderProps {
  conversation: ActiveConversation;
  onBack?: () => void;
}

export function ChatHeader({ conversation, onBack }: ChatHeaderProps) {
  return (
    <header className="flex items-center gap-3 border-b border-border px-4 py-3">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to inbox"
          className="soft-interactive flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-muted/40 hover:text-foreground"
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

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-muted/30 text-[11px] font-medium text-muted-foreground">
        {conversation.partnerInitial}
      </div>

      <p className="text-sm font-medium text-heading">Private conversation</p>
    </header>
  );
}
