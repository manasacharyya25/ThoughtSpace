"use client";

import { Button } from "@/components/ui/button";
import { useResponses } from "@/context/responses-context";
import { useUser } from "@/hooks/use-user";
import type { Post } from "@/types/post";

interface RespondButtonProps {
  post: Post;
}

export function RespondButton({ post }: RespondButtonProps) {
  const { openResponseModal, hasResponded } = useResponses();
  const { user } = useUser();
  const responded = hasResponded(post.id);
  const isOwnPost = user?.id === post.author_id;

  if (isOwnPost) {
    return (
      <span className="text-[11px] text-muted-foreground/60">Your thought</span>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => openResponseModal(post)}
      className="text-muted-foreground hover:text-foreground"
    >
      {responded ? "Responded" : "Respond →"}
    </Button>
  );
}
