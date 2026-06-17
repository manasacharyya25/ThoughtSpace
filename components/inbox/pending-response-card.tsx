"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useInbox } from "@/context/inbox-context";
import { inboxAcceptPath } from "@/lib/inbox-routes";
import { formatRelativeTime } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { PendingResponse } from "@/types/inbox";

interface PendingResponseCardProps {
  response: PendingResponse;
}

export function PendingResponseCard({ response }: PendingResponseCardProps) {
  const router = useRouter();
  const { isPendingUnread, markPendingSeen } = useInbox();
  const [expanded, setExpanded] = useState(false);
  const unread = isPendingUnread(response.id);

  const showReadMore =
    !expanded &&
    response.fullResponse.length > response.responsePreview.length;

  const handleExpand = () => {
    markPendingSeen(response.id);
    setExpanded(true);
  };

  const handleAccept = () => {
    markPendingSeen(response.id);
    router.push(inboxAcceptPath(response.id));
  };

  return (
    <article
      className={cn(
        "whisper-card space-y-3 rounded-xl p-4",
        unread && "border-landing-gold/40"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="relative shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-full border border-landing-border bg-gray-900 font-landing-mono text-xs text-landing-muted">
            {response.fromInitial}
          </div>
          {unread && (
            <span
              className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-rose-500 ring-2 ring-landing-bg"
              aria-label="Unread"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="font-landing-mono text-[10px] text-landing-muted">
              Anonymous Partner ({response.fromInitial})
            </span>
            <span className="font-landing-mono text-[10px] text-gray-600">
              {formatRelativeTime(response.receivedAt)}
            </span>
          </div>

          <p className="mt-2 font-landing-mono text-[10px] text-landing-muted">
            On your whisper: &ldquo;{response.thoughtExcerpt}&rdquo;
          </p>

          <p className="mt-2 text-sm font-light italic leading-relaxed text-gray-200">
            &ldquo;
            {expanded ? response.fullResponse : response.responsePreview}
            &rdquo;
          </p>

          {showReadMore && (
            <button
              type="button"
              onClick={handleExpand}
              className="mt-2 font-landing-mono text-[10px] text-landing-gold transition-colors hover:text-white"
            >
              Read full response →
            </button>
          )}
        </div>
      </div>

      <div className="flex justify-end border-t border-landing-border pt-3">
        <button
          type="button"
          onClick={handleAccept}
          className="rounded-lg bg-landing-gold px-4 py-2 font-landing-mono text-[10px] font-bold uppercase text-black transition-colors hover:bg-landing-gold-hover"
        >
          Accept connection & chat 1-to-1
        </button>
      </div>
    </article>
  );
}
