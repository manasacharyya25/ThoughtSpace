"use client";

import { useMemo, useState } from "react";
import { useInbox } from "@/context/inbox-context";
import { usePosts } from "@/context/posts-context";
import { useUser } from "@/hooks/use-user";
import { normalizeCategory } from "@/lib/category";
import {
  POST_MAX_LENGTH,
  validatePostForm,
} from "@/lib/post-validation";
import { formatRelativeTime } from "@/lib/time";
import { cn } from "@/lib/utils";
import type { PendingResponse } from "@/types/inbox";
import type { Post } from "@/types/post";
import { WHISPER_COMPOSER_TAGS } from "./constants";

interface WhisperCastViewProps {
  onAcceptConnection: (conversationId: string) => void;
}

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

export function WhisperCastView({ onAcceptConnection }: WhisperCastViewProps) {
  const { user } = useUser();
  const { posts, addPost } = usePosts();
  const { pending, acceptPending, pendingLoading } = useInbox();

  const [content, setContent] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [customTag, setCustomTag] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string>();
  const [acceptingId, setAcceptingId] = useState<string | null>(null);

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

  const resolvedTag = customTag.trim()
    ? normalizeCategory(customTag.replace(/^#/, ""))
    : selectedTag;

  const remainingChars = POST_MAX_LENGTH - content.length;

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
      await addPost(content, category);
      setContent("");
      setCustomTag("");
      setSelectedTag("");
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Could not cast whisper."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleAccept = async (pendingId: string) => {
    setAcceptingId(pendingId);
    try {
      const conversation = await acceptPending(pendingId, { redirect: false });
      if (conversation) {
        onAcceptConnection(conversation.id);
      }
    } finally {
      setAcceptingId(null);
    }
  };

  return (
    <div className="whisper-fade-in space-y-6">
      <div className="whisper-card whisper-cast-composer space-y-4 rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <label className="block font-landing-serif text-lg italic text-gray-200">
            Cast a whisper out to the world...
          </label>
          <span className="font-landing-mono text-[10px] text-gray-600">
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
              <span className="block font-landing-mono text-[10px] uppercase text-landing-muted">
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
                        "rounded-full border px-2.5 py-1 text-xs transition-colors",
                        isActive
                          ? "border-landing-gold bg-landing-gold/10 text-white"
                          : "border-landing-border text-landing-muted hover:border-landing-gold"
                      )}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="w-full space-y-2 sm:w-auto">
              <span className="block font-landing-mono text-[10px] uppercase text-landing-muted">
                Or type manually:
              </span>
              <input
                type="text"
                value={customTag}
                onChange={(e) => handleCustomTag(e.target.value)}
                placeholder="#type-custom-tag"
                className="landing-input w-full rounded-lg px-3 py-1.5 font-landing-mono text-xs placeholder:text-gray-600 sm:w-44"
              />
            </div>
          </div>

          {formError && (
            <p className="font-landing-mono text-xs text-red-400">{formError}</p>
          )}

          <div className="flex justify-end border-t border-landing-border pt-2">
            <button
              type="button"
              onClick={() => void handleCast()}
              disabled={submitting}
              className="w-full rounded-lg bg-white px-6 py-2.5 font-landing-mono text-xs font-semibold uppercase tracking-wider text-black transition-colors duration-300 hover:bg-landing-gold disabled:opacity-50 sm:w-auto"
            >
              {submitting ? "Casting…" : "Cast Whisper"}
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-landing-border pb-2">
          <h3 className="font-landing-mono text-xs uppercase tracking-widest text-landing-muted">
            Your Sent Whispers
          </h3>
        </div>

        {pendingLoading && myPosts.length === 0 ? (
          <p className="py-12 text-center font-landing-mono text-xs text-landing-muted">
            Loading your whispers…
          </p>
        ) : myPosts.length === 0 ? (
          <div className="rounded-2xl border border-landing-border bg-landing-card py-16 text-center font-landing-mono text-xs text-landing-muted">
            No whispers cast by you yet. Use the composer above to start.
          </div>
        ) : (
          <div className="space-y-4">
            {myPosts.map((post) => {
              const echoes = pendingByPost.get(post.id) ?? [];

              return (
                <article
                  key={post.id}
                  className="whisper-fade-in space-y-4 rounded-2xl border border-landing-border bg-landing-card p-6"
                >
                  <div className="flex items-center justify-between font-landing-mono text-xs text-landing-muted">
                    <span className="font-bold text-landing-gold">
                      #{normalizeCategory(post.category)}
                    </span>
                    <span>{formatRelativeTime(post.timestamp)}</span>
                  </div>

                  <p className="text-sm font-light italic leading-relaxed text-gray-200">
                    &ldquo;{post.content}&rdquo;
                  </p>

                  {echoes.length > 0 && (
                    <div className="space-y-3 border-t border-landing-border pt-4">
                      <p className="font-landing-mono text-xs text-landing-muted">
                        {echoes.length}{" "}
                        {echoes.length === 1 ? "response" : "responses"}
                      </p>
                      {echoes.map((echo) => (
                        <div
                          key={echo.id}
                          className="space-y-3 rounded-lg border border-landing-border bg-black p-4"
                        >
                          <div className="flex items-center justify-between font-landing-mono text-[10px] text-landing-muted">
                            <span>
                              Anonymous Partner ({echo.fromInitial})
                            </span>
                            <span>
                              received {formatRelativeTime(echo.receivedAt)}
                            </span>
                          </div>
                          <p className="text-xs italic leading-relaxed text-gray-300">
                            &ldquo;{echo.fullResponse}&rdquo;
                          </p>
                          <div className="flex justify-end pt-2">
                            <button
                              type="button"
                              onClick={() => void handleAccept(echo.id)}
                              disabled={acceptingId === echo.id}
                              className="rounded-lg bg-landing-gold px-4 py-2 font-landing-mono text-[10px] font-bold uppercase text-black transition-colors hover:bg-landing-gold-hover disabled:opacity-50"
                            >
                              {acceptingId === echo.id
                                ? "Opening channel…"
                                : "Accept connection & chat 1-to-1"}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
