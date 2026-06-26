"use client";

import type { ReactNode } from "react";
import { PostAuthorAvatar } from "@/components/feed/post-author-avatar";
import { normalizeCategory } from "@/lib/category";
import { cn } from "@/lib/utils";
import type { PostAuthorPreview } from "@/types/post";

interface WhisperPostCardProps {
  author?: PostAuthorPreview | null;
  avatarSeed: string;
  category: string;
  content: string;
  timestamp?: string;
  contentItalic?: boolean;
  footerLeft?: ReactNode;
  footerRight?: ReactNode;
  showFooter?: boolean;
  className?: string;
}

export function WhisperPostCard({
  author,
  avatarSeed,
  category,
  content,
  timestamp,
  contentItalic = false,
  footerLeft,
  footerRight,
  showFooter = true,
  className,
}: WhisperPostCardProps) {
  const username = author?.username ?? "unknown";

  return (
    <article
      className={cn(
        "whisper-card whisper-fade-in space-y-3 rounded-[20px] p-5 sm:p-6",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <PostAuthorAvatar name={avatarSeed} />
        <span
          className="min-w-0 flex-1 truncate text-sm font-extrabold text-[#1C1D1E]"
          title={`@${username}`}
        >
          @{username}
        </span>
      </div>

      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="font-bold text-landing-gold">
          #{normalizeCategory(category)}
        </span>
        {timestamp ? (
          <span className="shrink-0 text-landing-muted">{timestamp}</span>
        ) : null}
      </div>

      <p
        className={cn(
          "text-sm font-medium leading-relaxed text-[#1C1D1E]/75",
          contentItalic && "italic"
        )}
      >
        &ldquo;{content}&rdquo;
      </p>

      {showFooter && (footerLeft || footerRight) ? (
        <div className="flex flex-col gap-3 border-t border-[#1C1D1E]/[0.06] pt-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">{footerLeft}</div>
          <div className="flex shrink-0 items-center justify-end gap-3">
            {footerRight}
          </div>
        </div>
      ) : null}
    </article>
  );
}
