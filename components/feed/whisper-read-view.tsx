"use client";

import { useMemo, useState } from "react";
import { PostReactions } from "@/components/feed/post-reactions";
import { WhisperPostCard } from "@/components/feed/whisper-post-card";
import { useResponses } from "@/context/responses-context";
import { usePostReactions } from "@/hooks/use-post-reactions";
import { useUser } from "@/hooks/use-user";
import { formatRelativeTime } from "@/lib/time";
import { sortFeedForUser } from "@/lib/feed-sort";
import { normalizeCategory } from "@/lib/category";
import { postMatchesSearch } from "@/lib/post-search";
import { getPostAvatarSeed } from "@/lib/post-author";
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
    return sortedPosts.filter((post) => {
      if (user?.id && post.author_id === user.id) return false;

      const matchesTag =
        activeFilter === "all" ||
        normalizeCategory(post.category) === activeFilter;

      const matchesSearch = postMatchesSearch(
        post.content,
        post.category,
        searchQuery
      );

      return matchesTag && matchesSearch;
    });
  }, [sortedPosts, activeFilter, searchQuery, user?.id]);

  const filteredPostIds = useMemo(
    () => filteredPosts.map((post) => post.id),
    [filteredPosts]
  );

  const { getSummary, toggleReaction } = usePostReactions(filteredPostIds);

  return (
    <div className="whisper-fade-in space-y-6">
      <div className="flex flex-col justify-between gap-4 rounded-[20px] border border-[#1C1D1E]/[0.03] bg-white p-4 shadow-[0_24px_48px_-12px_rgba(28,29,30,0.08)] sm:flex-row sm:items-center">
        <div className="flex flex-wrap items-center gap-2">
          {WHISPER_FEED_TAGS.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setActiveFilter(tag)}
              className={cn(
                "whisper-tag-pill rounded-full px-3 py-1 text-[10px] font-bold sm:px-4 sm:py-1.5 sm:text-xs",
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
            placeholder="Search #tags or words…"
            className="landing-input w-full rounded-[14px] px-4 py-2 text-xs font-medium placeholder:text-[#1C1D1E]/35 sm:w-48"
          />
        </div>
      </div>

      {loading ? (
        <p className="py-16 text-center text-xs font-medium text-landing-muted">
          Scanning the whisper stream…
        </p>
      ) : error ? (
        <p className="py-16 text-center text-xs font-medium text-red-500">
          {error}
        </p>
      ) : filteredPosts.length === 0 ? (
        <div className="whisper-card rounded-[20px] py-16 text-center text-xs font-medium text-landing-muted">
          No whispers floating inside this frequency right now.
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post) => {
            const responded = hasResponded(post.id);

            return (
              <WhisperPostCard
                key={post.id}
                author={post.author}
                avatarSeed={getPostAvatarSeed(post, post.author)}
                category={post.category}
                content={post.content}
                timestamp={formatRelativeTime(post.timestamp)}
                footerLeft={
                  <PostReactions
                    postId={post.id}
                    summary={getSummary(post.id)}
                    onToggle={toggleReaction}
                    disabled={!user}
                  />
                }
                footerRight={
                  <>
                    {post.response_count > 0 && (
                      <span className="text-xs text-landing-muted">
                        {post.response_count}{" "}
                        {post.response_count === 1 ? "echo" : "echoes"}
                      </span>
                    )}
                    <button
                      type="button"
                      onClick={() => openResponseModal(post)}
                      disabled={responded}
                      className={cn(
                        "shrink-0 whitespace-nowrap rounded-2xl border border-[#1C1D1E]/10 px-3 py-1.5 text-xs font-bold text-landing-gold transition-colors hover:border-landing-gold hover:bg-[#EDF0F1]",
                        responded && "cursor-default opacity-50"
                      )}
                    >
                      {responded ? "Response transmitted" : "Respond"}
                    </button>
                  </>
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
