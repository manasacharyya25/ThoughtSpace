"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ChatComposerProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatComposer({ onSend, disabled }: ChatComposerProps) {
  const [value, setValue] = useState("");

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
  };

  return (
    <div className="border-t border-border bg-background/80 px-4 py-3 backdrop-blur-sm sm:px-5">
      <div className="flex items-end gap-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Write a reply..."
          rows={1}
          disabled={disabled}
          className={cn(
            "max-h-32 min-h-[42px] flex-1 resize-none rounded-xl border border-border bg-muted/30 px-4 py-2.5 text-[15px] leading-relaxed text-foreground transition-[border-color,background-color] duration-300 ease placeholder:text-muted-foreground/40 focus:outline-none focus:ring-1 focus:ring-white/10 disabled:opacity-50"
          )}
        />
        <button
          type="button"
          onClick={handleSend}
          disabled={disabled || !value.trim()}
          className="soft-interactive flex h-[42px] shrink-0 items-center justify-center rounded-xl border border-border px-4 text-sm font-medium text-foreground hover:border-white/10 hover:bg-muted/40 disabled:opacity-30"
        >
          Send
        </button>
      </div>
      <p className="mt-1.5 text-[10px] text-muted-foreground/40">
        Enter to send · Shift+Enter for new line
      </p>
    </div>
  );
}
