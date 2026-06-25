"use client";

import { EmojiPicker } from "frimousse";
import { cn } from "@/lib/utils";

interface PostEmojiPickerProps {
  onSelect: (emoji: string) => void;
  className?: string;
}

export function PostEmojiPicker({ onSelect, className }: PostEmojiPickerProps) {
  return (
    <EmojiPicker.Root
      className={cn(
        "flex h-[280px] w-[min(100vw-2rem,320px)] flex-col overflow-hidden rounded-[16px] border border-[#1C1D1E]/[0.06] bg-white shadow-[0_16px_40px_-12px_rgba(28,29,30,0.18)]",
        className
      )}
      onEmojiSelect={({ emoji }) => onSelect(emoji)}
    >
      <EmojiPicker.Search
        placeholder="Search emoji…"
        className="mx-2 mt-2 rounded-[10px] border border-[#1C1D1E]/[0.06] bg-[#FAF8F5] px-3 py-2 text-xs font-medium text-[#1C1D1E] outline-none placeholder:text-[#1C1D1E]/35"
      />
      <EmojiPicker.Viewport className="relative min-h-0 flex-1 outline-none">
        <EmojiPicker.Loading className="absolute inset-0 flex items-center justify-center text-xs font-medium text-[#1C1D1E]/45">
          Loading…
        </EmojiPicker.Loading>
        <EmojiPicker.Empty className="absolute inset-0 flex items-center justify-center text-xs font-medium text-[#1C1D1E]/45">
          No emoji found.
        </EmojiPicker.Empty>
        <EmojiPicker.List
          className="pb-2 select-none"
          components={{
            CategoryHeader: ({ category, ...props }) => (
              <div
                className="bg-white px-3 pt-2.5 pb-1 text-[10px] font-bold uppercase tracking-wider text-[#1C1D1E]/45"
                {...props}
              >
                {category.label}
              </div>
            ),
            Row: ({ children, ...props }) => (
              <div className="scroll-my-1 px-1.5" {...props}>
                {children}
              </div>
            ),
            Emoji: ({ emoji, ...props }) => (
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-lg text-lg transition-colors hover:bg-[#EBF5FF] data-[active]:bg-[#EBF5FF]"
                {...props}
              >
                {emoji.emoji}
              </button>
            ),
          }}
        />
      </EmojiPicker.Viewport>
    </EmojiPicker.Root>
  );
}
