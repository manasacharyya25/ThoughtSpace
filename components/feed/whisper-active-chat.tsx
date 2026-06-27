"use client";

import { useEffect, useRef, useState } from "react";
import { useInbox } from "@/context/inbox-context";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";
import type { ActiveConversation } from "@/types/inbox";
import "@/components/landing/colourful-landing.css";

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
        className="whisper-card flex flex-col justify-between rounded-[20px] p-6"
        style={{ minHeight: 520 }}
      >
        <div className="mb-4 flex items-center justify-between border-b border-[#1C1D1E]/[0.06] pb-4">
          <div className="space-y-0.5">
            <span className="block text-xs font-bold uppercase tracking-wider text-landing-gold">
              Connection: Anonymous ({conversation.partnerInitial})
            </span>
            <span className="block text-[10px] text-landing-muted">
              Matched on original raw realization
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleExchangeKey}
              className="rounded-2xl border border-[#1C1D1E]/10 bg-white px-3 py-1.5 text-[10px] font-medium text-landing-muted transition-colors hover:border-landing-gold hover:text-[#1C1D1E]"
            >
              Exchange Sonder Key
            </button>
            <button
              type="button"
              onClick={onExit}
              className="rounded-2xl bg-[#EDF0F1] px-3 py-1.5 text-[10px] font-medium text-landing-muted transition-colors hover:text-[#1C1D1E]"
            >
              Return to Feed
            </button>
          </div>
        </div>

        <div className="space-y-1 rounded-[14px] border border-[#1C1D1E]/[0.06] bg-[#EDF0F1] p-4 text-left text-xs text-landing-muted">
          <span className="block text-[9px] font-bold uppercase text-landing-gold">
            Origin Prompt:
          </span>
          <p className="font-medium italic">&ldquo;{conversation.startedFrom}&rdquo;</p>
        </div>

        <div
          ref={historyRef}
          className="flex-1 space-y-4 overflow-y-auto py-4 pr-1"
          style={{ maxHeight: 280, minHeight: 240 }}
        >
          {sonderKey && (
            <div className="border-b border-[#1C1D1E]/[0.06] py-2 text-center text-[10px] text-landing-muted">
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
                  "text-[10px] font-medium",
                  message.isFromMe ? "text-landing-muted" : "text-landing-gold"
                )}
              >
                {message.isFromMe ? "You" : conversation.partnerInitial} •{" "}
                {formatMessageTime(message.createdAt)}
              </span>
              <div
                className={cn(
                  "max-w-[85%] rounded-xl border border-[#1C1D1E]/[0.06] px-4 py-3 text-sm font-medium leading-relaxed",
                  message.isFromMe
                    ? "ml-auto rounded-tr-none bg-[#EDF0F1] text-right text-[#1C1D1E]"
                    : "mr-auto rounded-tl-none bg-white text-left text-[#1C1D1E]/80 shadow-sm"
                )}
              >
                {message.content}
              </div>
            </div>
          ))}
        </div>

        <div className="flex gap-3 border-t border-[#1C1D1E]/[0.06] pt-4">
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
            className="landing-input flex-1 rounded-[14px] px-4 py-3 text-sm font-medium"
          />
          <button
            type="button"
            onClick={() => void handleSend()}
            disabled={sending || !draft.trim()}
            className="colourful-landing-btn-primary rounded-2xl border-none bg-[#1C1D1E] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-all duration-300 hover:bg-[#2F9CFA] disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
