"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { usePosts } from "@/context/posts-context";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
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

  const charCount = content.length;
  const isNearLimit = charCount > POST_MAX_LENGTH * 0.9;
  const isOverLimit = charCount > POST_MAX_LENGTH;

  const handleDiscard = () => {
    router.push("/feed");
  };

  const handlePost = () => {
    setSubmitted(true);
    const validationErrors = validatePostForm(content, category);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    addPost(content, category);
    router.push("/feed");
  };

  return (
    <div className="mx-auto w-full max-w-2xl">
      <FadeIn index={0}>
        <button
          type="button"
          onClick={handleDiscard}
          className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4"
            aria-hidden="true"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
          Discard
        </button>
      </FadeIn>

      <FadeIn index={1}>
        <PageHeader
          title="Share a thought"
          description="No photos — just what's on your mind."
          action={
          <Button
            size="sm"
            variant="default"
            onClick={handlePost}
            disabled={isOverLimit}
          >
            Post
          </Button>
          }
        />
      </FadeIn>

      <div className="space-y-6">
        <FadeIn index={2} className="flex flex-wrap items-start gap-3">
          <span className="mt-2 text-sm text-muted-foreground">Category</span>
          <CategoryAutocomplete
            value={category}
            onChange={(value) => {
              setCategory(value);
              if (submitted) {
                setErrors(validatePostForm(content, value));
              }
            }}
            suggestions={categories}
            error={submitted ? errors.category : undefined}
            onBlur={() => {
              if (submitted) {
                setErrors(validatePostForm(content, category));
              }
            }}
          />
        </FadeIn>
        {submitted && errors.category && (
          <p className="text-xs text-red-400">{errors.category}</p>
        )}

        <FadeIn index={3} className="border-t border-border pt-6">
          <textarea
            value={content}
            onChange={(e) => {
              setContent(e.target.value);
              if (submitted) {
                setErrors(validatePostForm(e.target.value, category));
              }
            }}
            placeholder="What's on your mind? A question, a feeling, an idea..."
            rows={12}
            className={cn(
              "w-full resize-none bg-transparent text-[15px] leading-[1.7] text-foreground/90 placeholder:text-muted-foreground/50 focus:outline-none",
              submitted && errors.content && "placeholder:text-red-400/40"
            )}
            autoFocus
          />
          {submitted && errors.content && (
            <p className="mt-2 text-xs text-red-400">{errors.content}</p>
          )}
        </FadeIn>

        <FadeIn index={4} className="flex items-center justify-between border-t border-border pt-4">
          <span className="text-[11px] text-muted-foreground">
            Min {POST_MIN_LENGTH} characters
          </span>
          <span
            className={cn(
              "text-[11px] tabular-nums transition-colors",
              isOverLimit
                ? "text-red-400"
                : isNearLimit
                  ? "text-amber-400/80"
                  : "text-muted-foreground"
            )}
          >
            {charCount}/{POST_MAX_LENGTH}
          </span>
        </FadeIn>
      </div>
    </div>
  );
}
