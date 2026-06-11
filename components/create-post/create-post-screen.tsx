"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { usePosts } from "@/context/posts-context";
import { PageHeader } from "@/components/layout/page-header";
import { ResponseSuccess } from "@/components/response/response-success";
import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import {
  POST_MAX_LENGTH,
  POST_MIN_LENGTH,
  validatePostForm,
} from "@/lib/post-validation";
import { FadeIn } from "@/components/ui/fade-in";
import { cn } from "@/lib/utils";
import { CategoryAutocomplete } from "./category-autocomplete";

export function CreatePostScreen() {
  const router = useRouter();
  const { addPost, categories } = usePosts();
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [errors, setErrors] = useState<{ content?: string; category?: string }>(
    {}
  );
  const [submitted, setSubmitted] = useState(false);
  const [showPosted, setShowPosted] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [postError, setPostError] = useState<string>();

  const charCount = content.length;
  const isNearLimit = charCount > POST_MAX_LENGTH * 0.9;
  const isOverLimit = charCount > POST_MAX_LENGTH;

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    if (submitted) {
      setErrors(validatePostForm(content, value));
    }
  };

  const handleContentChange = (value: string) => {
    setContent(value);
    if (submitted) {
      setErrors(validatePostForm(value, category));
    }
  };

  const handlePost = async () => {
    setSubmitted(true);
    setPostError(undefined);
    const validationErrors = validatePostForm(content, category);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setIsPosting(true);
    try {
      await addPost(content, category);
      setShowPosted(true);
    } catch (err) {
      setPostError(
        err instanceof Error ? err.message : "Could not post. Try again."
      );
    } finally {
      setIsPosting(false);
    }
  };

  useEffect(() => {
    if (!showPosted) return;
    const timer = setTimeout(() => router.push("/feed"), 2800);
    return () => clearTimeout(timer);
  }, [showPosted, router]);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <FadeIn index={0}>
        <PageHeader
          title="Share a thought"
          description="No photos — just what's on your mind."
        />
      </FadeIn>

      <FadeIn index={1}>
        <article className="feed-card focus-within:border-white/[0.07]">
          <div className="flex items-start justify-between gap-4">
            <CategoryAutocomplete
              variant="badge"
              value={category}
              onChange={handleCategoryChange}
              suggestions={categories}
              error={submitted ? errors.category : undefined}
              onBlur={() => {
                if (submitted) {
                  setErrors(validatePostForm(content, category));
                }
              }}
            />
            <span
              className={cn(
                "shrink-0 text-[11px] tabular-nums transition-colors",
                isOverLimit
                  ? "text-red-400"
                  : isNearLimit
                    ? "text-amber-400/80"
                    : "text-muted-foreground/60"
              )}
            >
              {charCount > 0 ? `${charCount}/${POST_MAX_LENGTH}` : "Draft"}
            </span>
          </div>

          {submitted && errors.category && (
            <p className="mt-2 text-xs text-red-400">{errors.category}</p>
          )}

          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            placeholder="What's on your mind? A question, a feeling, an idea..."
            rows={10}
            className={cn(
              "mt-4 w-full resize-none bg-transparent text-[15px] leading-[1.7] text-foreground placeholder:text-muted-foreground/50 focus:outline-none",
              submitted && errors.content && "placeholder:text-red-400/40"
            )}
            autoFocus
          />

          {submitted && errors.content && (
            <p className="mt-2 text-xs text-red-400">{errors.content}</p>
          )}

          <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-4">
            <span className="text-[11px] text-muted-foreground">
              Min {POST_MIN_LENGTH} characters
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePost}
              disabled={isOverLimit || showPosted || isPosting}
              className="text-muted-foreground hover:text-foreground"
            >
              {isPosting ? "Posting…" : "Post →"}
            </Button>
          </div>
          {postError && (
            <p className="mt-2 text-xs text-red-400">{postError}</p>
          )}
        </article>
      </FadeIn>

      <Modal open={showPosted} onClose={() => {}}>
        <ResponseSuccess
          title="Thought shared"
          description="Your post is live on the feed."
        />
      </Modal>
    </div>
  );
}
