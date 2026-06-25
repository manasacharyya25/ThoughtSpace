"use client";

import { useEffect, useRef } from "react";
import { BOARD_MESSAGE_MAX_LENGTH } from "@/lib/board/constants";
import { validateBoardMessage } from "@/lib/board/validation";
import { cn } from "@/lib/utils";
import type { BoardMessage } from "@/types/board";

function formatMessageTime(date: string) {
  return new Intl.DateTimeFormat("en", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(date));
}

function MessageAvatar({ username }: { username: string }) {
  return (
    <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-[#EDF0F1] text-xs font-extrabold text-[#1C1D1E]/70">
      {username.charAt(0).toUpperCase()}
    </div>
  );
}

function BoardMessageRow({ message }: { message: BoardMessage }) {
  return (
    <div
      className={cn(
        "whisper-fade-in flex gap-3",
        message.isFromMe ? "flex-row-reverse" : "flex-row"
      )}
    >
      <MessageAvatar username={message.senderUsername} />
      <div
        className={cn(
          "flex max-w-[min(100%,520px)] flex-col gap-1",
          message.isFromMe ? "items-end" : "items-start"
        )}
      >
        <div
          className={cn(
            "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-[0_8px_24px_-12px_rgba(28,29,30,0.12)]",
            message.isFromMe
              ? "rounded-tr-md bg-[#2F9CFA]/12 text-[#1C1D1E]"
              : "rounded-tl-md border border-[#1C1D1E]/[0.06] bg-white text-[#1C1D1E]/80"
          )}
        >
          {message.content}
        </div>
        <div
          className={cn(
            "flex items-center gap-2 text-[10px] font-bold uppercase tracking-wide",
            message.isFromMe ? "flex-row-reverse text-landing-muted" : "text-landing-gold"
          )}
        >
          <span>@{message.senderUsername}</span>
          <span className="font-medium normal-case tracking-normal text-landing-muted">
            {formatMessageTime(message.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
}

interface BoardChatPanelProps {
  roomName: string;
  participantCount: number;
  messages: BoardMessage[];
  draft: string;
  formError?: string;
  sending: boolean;
  remainingChars: number;
  onDraftChange: (value: string) => void;
  onSend: () => void;
}

export function BoardChatPanel({
  roomName,
  participantCount,
  messages,
  draft,
  formError,
  sending,
  remainingChars,
  onDraftChange,
  onSend,
}: BoardChatPanelProps) {
  const historyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = historyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages.length]);

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col bg-[#FAF8F5]/50">
      <div className="border-b border-[#1C1D1E]/[0.06] bg-white px-4 py-3 text-center">
        <h1 className="text-sm font-extrabold text-[#1C1D1E] sm:text-base">
          {roomName}
          <span className="ml-1 font-medium text-landing-muted">
            ({participantCount})
          </span>
        </h1>
      </div>

      <div
        ref={historyRef}
        className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5"
      >
        {messages.length === 0 ? (
          <p className="py-12 text-center text-xs font-medium italic text-landing-muted">
            The room is quiet. Say hello to whoever&apos;s listening.
          </p>
        ) : (
          messages.map((message) => (
            <BoardMessageRow key={message.id} message={message} />
          ))
        )}
      </div>

      <div className="border-t border-[#1C1D1E]/[0.06] bg-white p-4">
        <div className="mb-2 flex items-center justify-between text-[10px] font-medium text-landing-muted">
          <span>Type something here…</span>
          <span>{remainingChars} remaining</span>
        </div>

        <div className="flex items-end gap-2">
          <textarea
            value={draft}
            onChange={(event) => onDraftChange(event.target.value)}
            rows={2}
            maxLength={BOARD_MESSAGE_MAX_LENGTH}
            placeholder="Type something here…"
            className="whisper-cast-textarea min-h-[52px] flex-1 rounded-xl p-3 text-sm leading-relaxed"
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                if (!sending && draft.trim()) onSend();
              }
            }}
          />
          <button
            type="button"
            onClick={onSend}
            disabled={sending || !draft.trim()}
            className="colourful-landing-btn-primary shrink-0 rounded-2xl border-none bg-[#1C1D1E] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#2F9CFA] disabled:opacity-50"
          >
            {sending ? "…" : "Send"}
          </button>
        </div>

        {formError ? (
          <p className="mt-2 text-[11px] font-medium text-red-500">{formError}</p>
        ) : null}
      </div>
    </section>
  );
}
