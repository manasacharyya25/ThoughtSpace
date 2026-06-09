"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { formatRelativeTime } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { PendingResponse } from "@/types/inbox";

interface PendingResponseCardProps {
  response: PendingResponse;
}

export function PendingResponseCard({ response }: PendingResponseCardProps) {
  const [expanded, setExpanded] = useState(false);
  const [replied, setReplied] = useState(false);

  return (
    <article
      className={cn(
        "inbox-card group transition-all duration-300",
        expanded && "inbox-card-expanded"
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/40 bg-muted/20 text-xs font-medium text-muted-foreground">
          {response.fromInitial}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] text-muted-foreground/60">
              {formatRelativeTime(response.receivedAt)}
            </span>
            <span className="rounded-full border border-border/30 px-2 py-0.5 text-[10px] capitalize text-muted-foreground/70">
              {response.category}
            </span>
          </div>

          <p className="mt-2 text-[12px] italic leading-relaxed text-muted-foreground/50">
            On your thought: &ldquo;{response.thoughtExcerpt}&rdquo;
          </p>

          <p className="mt-3 text-[15px] leading-[1.7] text-foreground/85">
            {expanded ? response.fullResponse : response.responsePreview}
          </p>

          {!expanded && response.fullResponse.length > response.responsePreview.length && (
            <button
              type="button"
              onClick={() => setExpanded(true)}
              className="mt-2 text-[12px] text-muted-foreground transition-colors hover:text-foreground"
            >
              Read more
            </button>
          )}

          <div className="mt-4 flex items-center gap-2">
            {replied ? (
              <span className="text-[12px] text-muted-foreground/60">
                Reply sent privately
              </span>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setReplied(true)}
                className="h-8 border-border/40 text-xs"
              >
                Reply
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
