"use client";

import { Button } from "@/components/ui/button";
import { useResponses } from "@/context/responses-context";
import type { Post } from "@/types/post";

interface RespondButtonProps {
  post: Post;
}

export function RespondButton({ post }: RespondButtonProps) {
  const { openResponseModal, hasResponded } = useResponses();
  const responded = hasResponded(post.id);

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => openResponseModal(post)}
      className="text-muted-foreground transition-all duration-200 hover:text-foreground group-hover:translate-x-0.5"
    >
      {responded ? "Responded" : "Respond"}
      {!responded && (
        <span
          aria-hidden="true"
          className="ml-1 inline-block transition-transform duration-200 group-hover:translate-x-0.5"
        >
          →
        </span>
      )}
    </Button>
  );
}
