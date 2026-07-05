"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { InboxItemMenu } from "@/components/inbox/inbox-item-menu";
import { useInbox } from "@/context/inbox-context";
import { useTrial } from "@/context/trial-context";
import { inboxAcceptPath } from "@/lib/inbox-routes";
import { formatRelativeTime } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { PendingResponse } from "@/types/inbox";
import "@/components/landing/colourful-landing.css";

interface PendingResponseCardProps {
  response: PendingResponse;
  onMarkRead: () => void;
  onMarkUnread: () => void;
  onDelete: () => void;
}

export function PendingResponseCard({
  response,
  onMarkRead,
  onMarkUnread,
  onDelete,
}: PendingResponseCardProps) {
  const router = useRouter();
  const { isPendingUnread } = useInbox();
  const { isGuest, promptInboxChatSignup } = useTrial();
  const [expanded, setExpanded] = useState(false);
  const unread = isPendingUnread(response.id);

  const showReadMore =
    !expanded &&
    response.fullResponse.length > response.responsePreview.length;

  const handleExpand = () => {
    onMarkRead();
    setExpanded(true);
  };

  const handleAccept = () => {
    onMarkRead();
    if (isGuest) {
      promptInboxChatSignup();
      return;
    }
    router.push(inboxAcceptPath(response.id));
  };

  return (
    <article
      className={cn(
        "whisper-card space-y-3 rounded-[20px] p-4",
        unread && "border-[#2F9CFA]/30"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFAB91] text-xs font-bold text-white">
            {response.fromInitial}
          </div>
          {unread && (
            <span
              className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-white"
              aria-label="Unread"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <span className="text-[10px] font-medium text-landing-muted">
              Anonymous Partner ({response.fromInitial})
            </span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] font-medium text-[#1C1D1E]/45">
                {formatRelativeTime(response.receivedAt)}
              </span>
              <InboxItemMenu
                actions={[
                  unread
                    ? { label: "Mark as read", onClick: onMarkRead }
                    : { label: "Mark as unread", onClick: onMarkUnread },
                  { label: "Delete", onClick: onDelete, destructive: true },
                ]}
              />
            </div>
          </div>

          <p className="mt-2 text-[10px] font-medium text-landing-muted">
            On your whisper: &ldquo;{response.thoughtExcerpt}&rdquo;
          </p>

          <p className="mt-2 text-sm font-medium italic leading-relaxed text-[#1C1D1E]/75">
            &ldquo;
            {expanded ? response.fullResponse : response.responsePreview}
            &rdquo;
          </p>

          {showReadMore && (
            <button
              type="button"
              onClick={handleExpand}
              className="mt-2 text-[10px] font-bold text-landing-gold transition-colors hover:text-[#1C1D1E]"
            >
              Read full response →
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-end border-t border-[#1C1D1E]/[0.06] pt-3">
        <button
          type="button"
          onClick={handleAccept}
          className="colourful-landing-btn-primary rounded-2xl border-none bg-[#1C1D1E] px-4 py-2 text-[10px] font-bold uppercase text-white transition-colors hover:bg-[#2F9CFA]"
        >
          Accept connection & chat 1-to-1
        </button>
      </div>
    </article>
  );
}
