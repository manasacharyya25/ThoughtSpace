"use client";

import { Smile } from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import { PostEmojiPicker } from "@/components/feed/post-emoji-picker";
import type { PostReactionSummary } from "@/types/post-reaction";
import { cn } from "@/lib/utils";

interface PostReactionsProps {
  postId: string;
  summary: PostReactionSummary;
  onToggle?: (postId: string, emoji: string) => void;
  disabled?: boolean;
  readOnly?: boolean;
}

export function PostReactions({
  postId,
  summary,
  onToggle,
  disabled = false,
  readOnly = false,
}: PostReactionsProps) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const pickerId = useId();

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  const handleSelect = (emoji: string) => {
    onToggle?.(postId, emoji);
    setOpen(false);
  };

  if (readOnly && summary.emojis.length === 0) {
    return null;
  }

  if (readOnly) {
    return (
      <div className="flex flex-wrap items-center gap-1.5">
        {summary.emojis.map((emoji) => (
          <span
            key={emoji}
            className="inline-flex min-h-8 min-w-8 items-center justify-center rounded-full border border-[#1C1D1E]/10 bg-white px-2 text-base leading-none"
            aria-label={`${emoji} reaction`}
          >
            {emoji}
          </span>
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative flex flex-wrap items-center gap-1.5">
      {summary.emojis.map((emoji) => {
        const isActive = summary.userEmoji === emoji;

        return (
          <button
            key={emoji}
            type="button"
            disabled={disabled}
            aria-label={isActive ? `Remove ${emoji} reaction` : `React with ${emoji}`}
            aria-pressed={isActive}
            onClick={() => onToggle?.(postId, emoji)}
            className={cn(
              "inline-flex min-h-8 min-w-8 items-center justify-center rounded-full border px-2 text-base leading-none transition-colors",
              isActive
                ? "border-[#2F9CFA]/30 bg-[#EBF5FF]"
                : "border-[#1C1D1E]/10 bg-white hover:border-[#2F9CFA]/20 hover:bg-[#FAF8F5]",
              disabled && "pointer-events-none opacity-50"
            )}
          >
            {emoji}
          </button>
        );
      })}

      <button
        type="button"
        disabled={disabled}
        aria-expanded={open}
        aria-controls={pickerId}
        aria-label="Add reaction"
        onClick={() => setOpen((value) => !value)}
        className={cn(
          "inline-flex size-8 items-center justify-center rounded-full border border-[#1C1D1E]/10 bg-white text-[#1C1D1E]/45 transition-colors hover:border-[#2F9CFA]/25 hover:bg-[#FAF8F5] hover:text-[#2F9CFA]",
          open && "border-[#2F9CFA]/30 bg-[#EBF5FF] text-[#2F9CFA]",
          disabled && "pointer-events-none opacity-50"
        )}
      >
        <Smile className="size-4" strokeWidth={2.25} aria-hidden="true" />
      </button>

      {open ? (
        <div
          id={pickerId}
          className="absolute bottom-full left-0 z-50 mb-2"
          role="dialog"
          aria-label="Emoji picker"
        >
          <PostEmojiPicker onSelect={handleSelect} />
        </div>
      ) : null}
    </div>
  );
}
