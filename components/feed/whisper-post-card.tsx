"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { PostAuthorAvatar } from "@/components/feed/post-author-avatar";
import { PostAuthorBadge } from "@/components/feed/post-author-badge";
import { PostReadModal } from "@/components/feed/post-read-modal";
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
  const contentRef = useRef<HTMLParagraphElement>(null);
  const [isClamped, setIsClamped] = useState(false);
  const [readModalOpen, setReadModalOpen] = useState(false);

  useEffect(() => {
    const element = contentRef.current;
    if (!element) return;

    const checkClamp = () => {
      const clamped = element.scrollHeight > element.clientHeight + 1;
      const longContent = content.length > 200;
      setIsClamped(clamped || longContent);
    };

    checkClamp();

    const observer = new ResizeObserver(checkClamp);
    observer.observe(element);
    return () => observer.disconnect();
  }, [content]);

  return (
    <>
      <article
        className={cn(
          "whisper-card whisper-fade-in min-w-0 space-y-3 overflow-hidden rounded-[20px] p-5 sm:p-6",
          className
        )}
      >
        <div className="flex min-w-0 items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <PostAuthorAvatar name={avatarSeed} />
            <span
              className="min-w-0 flex-1 truncate text-sm font-extrabold text-[#1C1D1E]"
              title={`@${username}`}
            >
              @{username}
            </span>
          </div>
          {author ? <PostAuthorBadge author={author} /> : null}
        </div>

        <div className="flex min-w-0 items-center justify-between gap-3 text-xs">
          <span className="font-bold text-landing-gold">
            #{normalizeCategory(category)}
          </span>
          {timestamp ? (
            <span className="shrink-0 text-landing-muted">{timestamp}</span>
          ) : null}
        </div>

        <div className="min-w-0">
          <p
            ref={contentRef}
            className={cn(
              "whisper-post-content line-clamp-4 text-sm font-medium leading-relaxed text-[#1C1D1E]/75",
              contentItalic && "italic"
            )}
          >
            &ldquo;{content}&rdquo;
          </p>
          {isClamped ? (
            <button
              type="button"
              onClick={() => setReadModalOpen(true)}
              className="mt-2 text-[10px] font-bold text-landing-gold transition-colors hover:text-[#1C1D1E]"
            >
              Read more →
            </button>
          ) : null}
        </div>

        {showFooter && (footerLeft || footerRight) ? (
          <div className="flex min-w-0 items-center justify-between gap-2 border-t border-[#1C1D1E]/[0.06] pt-4">
            <div className="min-w-0 shrink">{footerLeft}</div>
            <div className="flex shrink-0 flex-nowrap items-center justify-end gap-2">
              {footerRight}
            </div>
          </div>
        ) : null}
      </article>

      <PostReadModal
        open={readModalOpen}
        onClose={() => setReadModalOpen(false)}
        content={content}
        contentItalic={contentItalic}
      />
    </>
  );
}
