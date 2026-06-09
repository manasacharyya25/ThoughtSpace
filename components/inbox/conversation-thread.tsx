"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ActiveConversation } from "@/types/inbox";

interface ConversationThreadProps {
  conversation: ActiveConversation;
}

function formatTime(date: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export function ConversationThread({ conversation }: ConversationThreadProps) {
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    if (!draft.trim()) return;
    setSent(true);
    setDraft("");
    setTimeout(() => setSent(false), 2000);
  };

  return (
    <div className="space-y-3">
      {conversation.messages.map((message) => (
        <div
          key={message.id}
          className={cn("flex", message.isFromMe ? "justify-end" : "justify-start")}
        >
          <div
            className={cn(
              "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-[14px] leading-[1.65]",
              message.isFromMe
                ? "bg-muted/50 text-foreground/90"
                : "border border-border/30 bg-surface/50 text-foreground/80"
            )}
          >
            <p>{message.content}</p>
            <p className="mt-1.5 text-right text-[10px] text-muted-foreground/50">
              {formatTime(message.createdAt)}
            </p>
          </div>
        </div>
      ))}

      <div className="mt-4 space-y-2 border-t border-border/20 pt-4">
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Continue the conversation..."
          rows={2}
          className="w-full resize-none rounded-lg border border-border/30 bg-muted/20 px-3 py-2 text-[14px] leading-relaxed text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-border/50"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />
        <div className="flex items-center justify-between">
          {sent ? (
            <span className="text-[11px] text-muted-foreground/60">
              Sent privately
            </span>
          ) : (
            <span className="text-[11px] text-muted-foreground/40">
              Enter to send
            </span>
          )}
          <Button size="sm" variant="ghost" onClick={handleSend} className="h-7 text-xs">
            Send
          </Button>
        </div>
      </div>
    </div>
  );
}
