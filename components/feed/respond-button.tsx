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
      className="text-muted-foreground hover:text-foreground"
    >
      {responded ? "Responded" : "Respond →"}
    </Button>
  );
}
