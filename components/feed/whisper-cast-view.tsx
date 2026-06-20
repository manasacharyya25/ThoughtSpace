"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useInbox } from "@/context/inbox-context";
import { usePosts } from "@/context/posts-context";
import { useResponses } from "@/context/responses-context";
import { useUser } from "@/hooks/use-user";
import { normalizeCategory } from "@/lib/category";
import {
  POST_MAX_LENGTH,
  validatePostForm,
} from "@/lib/post-validation";
import {
  clearResonanceAnchor,
  loadResonanceAnchor,
  saveResonanceAnchor,
  type ResonanceAnchor,
} from "@/lib/resonance-anchor-storage";
import { findResonanceSuggestions } from "@/lib/resonance-suggestions";
import { formatRelativeTime } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { PendingResponse } from "@/types/inbox";
import type { Post } from "@/types/post";
import { WHISPER_COMPOSER_TAGS } from "./constants";
import "@/components/landing/colourful-landing.css";

const MATCH_SEARCH_MS = 2800;

function groupPendingByPost(
  posts: Post[],
  pending: PendingResponse[]
): Map<string, PendingResponse[]> {
  const map = new Map<string, PendingResponse[]>();

  for (const post of posts) {
    map.set(post.id, []);
  }

  for (const item of pending) {
    const existing = map.get(item.postId);
    if (existing) {
      existing.push(item);
    }
  }

  return map;
}

function WaitingMessage({
  message,
  golden = false,
  showDots = true,
  align = "left",
}: {
  message: string;
  golden?: boolean;
  showDots?: boolean;
  align?: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "flex items-center py-3 text-xs font-medium italic leading-relaxed",
        align === "right" && "justify-end text-right",
        showDots && "space-x-2",
        golden ? "text-landing-gold" : "text-landing-muted"
      )}
    >
      <span>{message}</span>
      {showDots && (
        <span className="flex shrink-0 space-x-1">
          {[0, 0.2, 0.4].map((delay) => (
            <span
              key={delay}
              className={cn(
                "h-1 w-1 animate-ping rounded-full",
                golden ? "bg-landing-gold" : "bg-landing-muted"
              )}
              style={{ animationDelay: `${delay}s` }}
            />
          ))}
        </span>
      )}
    </div>
  );
}

export function WhisperCastView() {
  const { user } = useUser();
  const { posts, addPost, loading: postsLoading } = usePosts();
  const { pending, pendingLoading, isPendingUnread } = useInbox();
  const { openResponseModal, hasResponded } = useResponses();

  const [content, setContent] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [customTag, setCustomTag] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string>();
  const [resonanceAnchor, setResonanceAnchor] = useState<ResonanceAnchor | null>(
    null
  );
  const [isSearchingMatches, setIsSearchingMatches] = useState(false);
  const [anchorHydrated, setAnchorHydrated] = useState(false);
  const [showCastToast, setShowCastToast] = useState(false);
  const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const myPosts = useMemo(
    () =>
      posts
        .filter((post) => post.author_id === user?.id)
        .sort(
          (a, b) =>
            new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        ),
    [posts, user?.id]
  );

  const pendingByPost = useMemo(
    () => groupPendingByPost(myPosts, pending),
    [myPosts, pending]
  );

  const anchorPost = useMemo(() => {
    if (!resonanceAnchor) return null;
    return posts.find((post) => post.id === resonanceAnchor.postId) ?? null;
  }, [posts, resonanceAnchor]);

  const resonanceSuggestions = useMemo(() => {
    if (!resonanceAnchor || !user?.id || isSearchingMatches) return [];

    return findResonanceSuggestions(
      posts,
      resonanceAnchor.category,
      resonanceAnchor.postId,
      user.id,
      hasResponded,
      3
    );
  }, [
    posts,
    resonanceAnchor,
    user?.id,
    hasResponded,
    isSearchingMatches,
  ]);

  const resolvedTag = customTag.trim()
    ? normalizeCategory(customTag.replace(/^#/, ""))
    : selectedTag;

  const remainingChars = POST_MAX_LENGTH - content.length;

  const beginMatchSearch = useCallback(() => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    setIsSearchingMatches(true);
    searchTimeoutRef.current = setTimeout(() => {
      setIsSearchingMatches(false);
      searchTimeoutRef.current = null;
    }, MATCH_SEARCH_MS);
  }, []);

  const setActiveAnchor = useCallback(
    (anchor: ResonanceAnchor, runSearch: boolean) => {
      setResonanceAnchor(anchor);
      saveResonanceAnchor(anchor);
      if (runSearch) beginMatchSearch();
    },
    [beginMatchSearch]
  );

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
  }, []);

  useEffect(() => {
    if (!showCastToast) return;
    const timer = setTimeout(() => setShowCastToast(false), 4500);
    return () => clearTimeout(timer);
  }, [showCastToast]);

  useEffect(() => {
    if (!user?.id || anchorHydrated) return;

    const stored = loadResonanceAnchor();
    if (!stored || stored.userId !== user.id) {
      setAnchorHydrated(true);
      return;
    }

    if (postsLoading) return;

    const latest = myPosts[0];
    if (latest?.id === stored.postId) {
      setResonanceAnchor(stored);
    } else {
      clearResonanceAnchor();
    }

    setAnchorHydrated(true);
  }, [user?.id, myPosts, anchorHydrated, postsLoading]);

  useEffect(() => {
    if (!resonanceAnchor || !user?.id) return;

    const latest = myPosts[0];
    if (!latest || latest.id !== resonanceAnchor.postId) {
      setResonanceAnchor(null);
      clearResonanceAnchor();
    }
  }, [myPosts, resonanceAnchor, user?.id]);

  const selectPresetTag = (tag: string) => {
    setCustomTag("");
    setSelectedTag(normalizeCategory(tag.replace(/^#/, "")));
  };

  const handleCustomTag = (value: string) => {
    setCustomTag(value);
    const processed = value.trim().replace(/^#/, "");
    if (processed) {
      setSelectedTag(normalizeCategory(processed));
    }
  };

  const handleCast = async () => {
    const category = resolvedTag || "wonder";
    const validation = validatePostForm(content, category);
    if (Object.keys(validation).length > 0) {
      setFormError(
        validation.content ?? validation.category ?? "Could not cast whisper."
      );
      return;
    }

    setSubmitting(true);
    setFormError(undefined);

    try {
      const created = await addPost(content, category);
      setContent("");
      setCustomTag("");
      setSelectedTag("");

      if (user?.id) {
        setActiveAnchor(
          {
            userId: user.id,
            postId: created.id,
            category: created.category,
            castAt: created.timestamp,
          },
          true
        );
      }

      setShowCastToast(true);
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Could not cast whisper."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const sentWhispers = resonanceAnchor
    ? myPosts.filter((post) => post.id !== resonanceAnchor.postId)
    : myPosts;

  return (
    <>
    <div className="whisper-fade-in space-y-6">
      <div className="whisper-card whisper-cast-composer space-y-4 rounded-2xl p-6">
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <label className="block min-w-0 text-base font-extrabold text-[#1C1D1E]">
            Cast a whisper out to the world...
          </label>
          <span className="shrink-0 text-[10px] font-medium text-landing-muted">
            {remainingChars} remaining
          </span>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
          maxLength={POST_MAX_LENGTH}
          placeholder="Type a feeling or raw realization. Once cast, anonymous minds in our network can view and whisper responses back to you..."
          className="whisper-cast-textarea w-full rounded-xl p-4 text-sm leading-relaxed"
        />

        <div className="space-y-3 pt-2">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div className="space-y-2">
              <span className="block text-[10px] font-bold uppercase text-landing-muted">
                Select Resonance Tag:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {WHISPER_COMPOSER_TAGS.map((tag) => {
                  const normalized = normalizeCategory(tag.replace(/^#/, ""));
                  const isActive = !customTag && selectedTag === normalized;

                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => selectPresetTag(tag)}
                      className={cn(
                        "rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
                        isActive
                          ? "border-landing-gold bg-[#2F9CFA]/10 text-[#1C1D1E]"
                          : "border-[#1C1D1E]/10 text-landing-muted hover:border-landing-gold"
                      )}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="w-full space-y-2 sm:w-auto">
              <span className="block text-[10px] font-bold uppercase text-landing-muted">
                Or type manually:
              </span>
              <input
                type="text"
                value={customTag}
                onChange={(e) => handleCustomTag(e.target.value)}
                placeholder="#type-custom-tag"
                className="landing-input w-full rounded-[14px] px-3 py-1.5 text-xs font-medium placeholder:text-[#1C1D1E]/35 sm:w-44"
              />
            </div>
          </div>

          {formError && (
            <p className="text-xs font-medium text-red-500">{formError}</p>
          )}

          <div className="flex justify-end border-t border-[#1C1D1E]/[0.06] pt-2">
            <button
              type="button"
              onClick={() => void handleCast()}
              disabled={submitting}
              className="colourful-landing-btn-primary w-full rounded-2xl border-none bg-[#1C1D1E] px-6 py-3 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#2F9CFA] disabled:opacity-50 sm:w-auto"
            >
              {submitting ? "Casting…" : "Cast Whisper"}
            </button>
          </div>
        </div>
      </div>

      {anchorPost && resonanceAnchor && (
        <article className="whisper-fade-in whisper-card space-y-4 rounded-[20px] p-6">
          <div className="flex items-center justify-between text-xs text-landing-muted">
            <span>Your Cast Whisper</span>
            <span>{formatRelativeTime(anchorPost.timestamp)}</span>
          </div>

          <p className="text-sm font-medium italic leading-relaxed text-[#1C1D1E]/75">
            &ldquo;{anchorPost.content}&rdquo;
          </p>

          {isSearchingMatches ? (
            <WaitingMessage message="Scanning the ether for echoes" />
          ) : (
            <div className="space-y-4 border-t border-[#1C1D1E]/[0.06] pt-4">
              {resonanceSuggestions.length === 0 ? (
                <WaitingMessage
                  golden
                  align="right"
                  showDots={false}
                  message="The ether is quiet on this one. Perhaps you're the first one to ask"
                />
              ) : (
                <>
                  <div className="space-y-1">
                    <h4 className="text-base font-extrabold text-[#1C1D1E] sm:text-lg">
                      People in the same space as you
                    </h4>
                    <span className="block text-[10px] font-bold uppercase tracking-wider text-landing-gold">
                      Resonance suggestions ({resonanceSuggestions.length})
                    </span>
                  </div>

                  <div className="space-y-3">
                  {resonanceSuggestions.map((suggestion) => (
                    <div
                      key={suggestion.id}
                      className="space-y-3 rounded-[14px] border border-[#1C1D1E]/[0.06] bg-[#EDF0F1] p-4"
                    >
                      <div className="flex items-center justify-between text-xs text-landing-muted">
                        <span className="font-bold text-landing-gold">
                          #{normalizeCategory(suggestion.category)}
                        </span>
                        <span>
                          {formatRelativeTime(suggestion.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs font-medium italic leading-relaxed text-[#1C1D1E]/70">
                        &ldquo;{suggestion.content}&rdquo;
                      </p>
                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={() => openResponseModal(suggestion)}
                          disabled={hasResponded(suggestion.id)}
                          className={cn(
                            "text-xs font-bold text-landing-gold transition-colors hover:text-[#1C1D1E]",
                            hasResponded(suggestion.id) &&
                              "cursor-default opacity-50"
                          )}
                        >
                          {hasResponded(suggestion.id)
                            ? "Response transmitted"
                            : "Send an anonymous response →"}
                        </button>
                      </div>
                    </div>
                  ))}
                  </div>
                </>
              )}
            </div>
          )}
        </article>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#1C1D1E]/[0.06] pb-2">
          <h3 className="text-xs font-bold uppercase tracking-widest text-landing-muted">
            Your Sent Whispers
          </h3>
        </div>

        {pendingLoading && sentWhispers.length === 0 && !anchorPost ? (
          <p className="py-12 text-center text-xs font-medium text-landing-muted">
            Loading your whispers…
          </p>
        ) : sentWhispers.length === 0 && !anchorPost ? (
          <div className="whisper-card rounded-[20px] py-16 text-center text-xs font-medium text-landing-muted">
            No whispers cast by you yet. Use the composer above to start.
          </div>
        ) : sentWhispers.length === 0 ? null : (
          <div className="space-y-4">
            {sentWhispers.map((post) => {
              const pendingEchoes = pendingByPost.get(post.id) ?? [];
              const hasNewEcho = pendingEchoes.some((echo) =>
                isPendingUnread(echo.id)
              );
              const responseCount = Math.max(
                post.response_count,
                pendingEchoes.length
              );

              return (
                <article
                  key={post.id}
                  className="whisper-fade-in whisper-card space-y-4 rounded-[20px] p-6"
                >
                  <div className="flex items-center justify-between text-xs text-landing-muted">
                    <span className="font-bold text-landing-gold">
                      #{normalizeCategory(post.category)}
                    </span>
                    <span>{formatRelativeTime(post.timestamp)}</span>
                  </div>

                  <p className="text-sm font-medium italic leading-relaxed text-[#1C1D1E]/75">
                    &ldquo;{post.content}&rdquo;
                  </p>

                  {responseCount > 0 && (
                    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#1C1D1E]/[0.06] pt-4">
                      <p className="text-xs text-landing-muted">
                        {responseCount}{" "}
                        {responseCount === 1 ? "response" : "responses"}
                        {hasNewEcho && (
                          <span className="ml-2 text-landing-gold">
                            · new
                          </span>
                        )}
                      </p>
                      {hasNewEcho && (
                        <Link
                          href="/inbox"
                          className="text-[10px] font-bold text-landing-gold transition-colors hover:text-[#1C1D1E]"
                        >
                          Open inbox →
                        </Link>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>

      {showCastToast && (
        <div className="fixed bottom-6 right-6 z-50 flex max-w-sm items-start gap-3 rounded-[20px] border border-[#1C1D1E]/[0.06] bg-white px-5 py-4 shadow-[0_24px_48px_-12px_rgba(28,29,30,0.12)]">
          <span className="font-bold text-[#2F9CFA]">✓</span>
          <div>
            <h5 className="text-xs font-bold uppercase tracking-wider text-[#2F9CFA]">
              Cast
            </h5>
            <p className="mt-1 text-xs font-medium leading-relaxed text-[#1C1D1E]/55">
              Your whisper is out in the stream. Anonymous minds can now
              respond.
            </p>
          </div>
        </div>
      )}
    </>
  );
}
