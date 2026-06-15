"use client";

import type { ActiveConversation } from "@/types/inbox";

interface ChatHeaderProps {
  conversation: ActiveConversation;
  onBack?: () => void;
}

export function ChatHeader({ conversation, onBack }: ChatHeaderProps) {
  return (
    <header className="inbox-chat-header">
      {onBack && (
        <button
          type="button"
          onClick={onBack}
          aria-label="Back to inbox"
          className="inbox-chat-back"
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

      <div className="inbox-chat-avatar">{conversation.partnerInitial}</div>

      <p className="inbox-chat-title">
        <span className="inbox-chat-title-gold">Private</span> conversation
      </p>
    </header>
  );
}
