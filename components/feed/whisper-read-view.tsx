"use client";

import { useMemo, useState } from "react";
import { useResponses } from "@/context/responses-context";
import { useUser } from "@/hooks/use-user";
import { formatRelativeTime } from "@/lib/time";
import { sortFeedForUser } from "@/lib/feed-sort";
import { normalizeCategory } from "@/lib/category";
import { cn } from "@/lib/utils";
import type { Post } from "@/types/post";
import {
  WHISPER_FEED_TAGS,
  type WhisperFeedTag,
} from "./constants";

interface WhisperReadViewProps {
  posts: Post[];
  loading: boolean;
  error: string | null;
}

export function WhisperReadView({ posts, loading, error }: WhisperReadViewProps) {
  const { openResponseModal, hasResponded } = useResponses();
  const { user } = useUser();
  const [activeFilter, setActiveFilter] = useState<WhisperFeedTag>("all");
  const [searchQuery, setSearchQuery] = useState("");

  const sortedPosts = useMemo(
    () => sortFeedForUser(posts, hasResponded, user?.id),
    [posts, hasResponded, user?.id]
  );

  const filteredPosts = useMemo(() => {
    const search = searchQuery.trim().toLowerCase();

    return sortedPosts.filter((post) => {
      if (user?.id && post.author_id === user.id) return false;

      const matchesTag =
        activeFilter === "all" ||
        normalizeCategory(post.category) === activeFilter;

      const matchesSearch =
        !search || post.content.toLowerCase().includes(search);

      return matchesTag && matchesSearch;
    });
  }, [sortedPosts, activeFilter, searchQuery, user?.id]);

  return (
    <div className="whisper-fade-in space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-xl border border-landing-border bg-landing-card p-4 sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          {WHISPER_FEED_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveFilter(tag)}
              className={cn(
                "whisper-tag-pill rounded-full px-3 py-1 font-landing-mono text-[10px] sm:px-4 sm:py-1.5 sm:text-xs",
                activeFilter === tag && "active"
              )}
            >
              #{tag}
            </button>
          ))}
        </div>
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search raw thoughts..."
            className="landing-input w-full rounded-lg px-4 py-2 font-landing-mono text-xs placeholder:text-gray-600 sm:w-48"
          />
        </div>
      </div>

      {loading ? (
        <p className="py-16 text-center font-landing-mono text-xs text-landing-muted">
          Scanning the whisper stream…
        </p>
      ) : error ? (
        <p className="py-16 text-center font-landing-mono text-xs text-red-400">
          {error}
        </p>
      ) : filteredPosts.length === 0 ? (
        <div className="rounded-2xl border border-landing-border bg-landing-card py-16 text-center font-landing-mono text-xs text-landing-muted">
          No whispers floating inside this frequency right now.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const responded = hasResponded(post.id);

            return (
              <article
                key={post.id}
                className="whisper-card whisper-fade-in flex flex-col justify-between space-y-4 rounded-xl p-6"
              >
                <div className="flex items-center justify-between font-landing-mono text-xs text-landing-muted">
                  <span className="font-bold text-landing-gold">
                    #{normalizeCategory(post.category)}
                  </span>
                  <span>Matched {formatRelativeTime(post.timestamp)}</span>
                </div>

                <p className="text-sm font-light leading-relaxed text-gray-200">
                  &ldquo;{post.content}&rdquo;
                </p>

                <div
                  className={cn(
                    "flex items-center border-t border-landing-border pt-4",
                    post.response_count > 0
                      ? "justify-between"
                      : "justify-end"
                  )}
                >
                  {post.response_count > 0 && (
                    <span className="font-landing-mono text-xs text-gray-600">
                      {post.response_count}{" "}
                      {post.response_count === 1 ? "echo" : "echoes"} matched
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => openResponseModal(post)}
                    disabled={responded}
                    className={cn(
                      "rounded-lg border border-landing-border px-3 py-1.5 font-landing-mono text-xs text-landing-gold transition-colors hover:border-landing-gold hover:text-white",
                      responded && "cursor-default opacity-50"
                    )}
                  >
                    {responded
                      ? "Response transmitted"
                      : "Send direct response →"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
