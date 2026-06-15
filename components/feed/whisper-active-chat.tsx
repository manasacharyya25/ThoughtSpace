"use client";

import { useEffect, useRef, useState } from "react";
import { useInbox } from "@/context/inbox-context";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";
import type { ActiveConversation } from "@/types/inbox";

interface WhisperActiveChatProps {
  conversation: ActiveConversation;
  onExit: () => void;
}

function formatMessageTime(date: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

export function WhisperActiveChat({
  conversation,
  onExit,
}: WhisperActiveChatProps) {
  const { sendMessage } = useInbox();
  const [draft, setDraft] = useState("");
  const [sending, setSending] = useState(false);
  const [sonderKey, setSonderKey] = useState<string | null>(null);
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = historyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [conversation.messages.length, sonderKey]);

  const handleSend = async () => {
    const trimmed = draft.trim();
    if (!trimmed || sending) return;

    setSending(true);
    setDraft("");
    try {
      await sendMessage(conversation.id, trimmed);
    } finally {
      setSending(false);
    }
  };

  const handleExchangeKey = () => {
    const key = `KEY-${Math.floor(1000 + Math.random() * 9000)}-${conversation.partnerInitial.toUpperCase()}`;
    setSonderKey(key);
  };

  return (
    <div className="whisper-fade-in space-y-6">
      <div
        className="flex flex-col justify-between rounded-2xl border border-landing-border bg-landing-card p-6"
        style={{ minHeight: 520 }}
      >
        <div className="mb-4 flex items-center justify-between border-b border-landing-border pb-4">
          <div className="space-y-0.5">
            <span className="block font-landing-mono text-xs uppercase tracking-wider text-landing-gold">
              Connection: Anonymous ({conversation.partnerInitial})
            </span>
            <span className="block font-landing-mono text-[10px] text-landing-muted">
              Matched on original raw realization
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleExchangeKey}
              className="rounded-lg border border-landing-border bg-black px-3 py-1.5 font-landing-mono text-[10px] text-landing-muted transition-colors hover:border-landing-gold hover:text-white"
            >
              Exchange Sonder Key
            </button>
            <button
              type="button"
              onClick={onExit}
              className="rounded-lg bg-landing-card px-3 py-1.5 font-landing-mono text-[10px] text-landing-muted transition-colors hover:text-white"
            >
              Return to Feed
            </button>
          </div>
        </div>

        <div
          className="space-y-1 rounded-xl border border-landing-border p-4 text-left text-xs text-landing-muted"
          style={{ backgroundColor: "rgba(212,195,145,0.02)" }}
        >
          <span className="block font-landing-mono text-[9px] uppercase text-landing-gold">
            Origin Prompt:
          </span>
          <p className="font-light italic">&ldquo;{conversation.startedFrom}&rdquo;</p>
        </div>

        <div
          ref={historyRef}
          className="flex-1 space-y-4 overflow-y-auto py-4 pr-1"
          style={{ maxHeight: 280, minHeight: 240 }}
        >
          {sonderKey && (
            <div className="border-b border-black py-2 text-center font-landing-mono text-[10px] text-landing-muted">
              Shared Sonder Key generated: &ldquo;{sonderKey}&rdquo;. Save this
              code to reconnect inside {env.NEXT_PUBLIC_APP_NAME}.
            </div>
          )}

          {conversation.messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "whisper-fade-in flex w-full flex-col space-y-1",
                message.isFromMe ? "items-end" : "items-start"
              )}
            >
              <span
                className={cn(
                  "font-landing-mono text-[10px]",
                  message.isFromMe ? "text-landing-muted" : "text-landing-gold"
                )}
              >
                {message.isFromMe ? "You" : conversation.partnerInitial} •{" "}
                {formatMessageTime(message.createdAt)}
              </span>
              <div
                className={cn(
                  "max-w-[85%] rounded-xl border border-landing-border px-4 py-3 text-sm font-light leading-relaxed",
                  message.isFromMe
                    ? "ml-auto rounded-tr-none bg-landing-input text-right"
                    : "mr-auto rounded-tl-none bg-[#070706] text-left"
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 border-t border-landing-border pt-4">
          <input
            type="text"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                void handleSend();
              }
            }}
            placeholder="Write your genuine response..."
            disabled={sending}
            className="landing-input flex-1 rounded-xl px-4 py-3 text-sm"
          />
          <button
            type="button"
            onClick={() => void handleSend()}
            disabled={sending || !draft.trim()}
            className="rounded-xl bg-white px-6 py-3 font-landing-mono text-xs font-bold uppercase tracking-wider text-black transition-all duration-300 hover:bg-landing-gold disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
