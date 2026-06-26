"use client";

import Avatar from "boring-avatars";
import {
  WHISPER_AVATAR_COLORS,
  WHISPER_AVATAR_SIZE,
  WHISPER_AVATAR_VARIANT,
} from "@/lib/avatar/constants";
import { cn } from "@/lib/utils";

interface PostAuthorAvatarProps {
  name: string;
  size?: number;
  className?: string;
}

export function PostAuthorAvatar({
  name,
  size = WHISPER_AVATAR_SIZE,
  className,
}: PostAuthorAvatarProps) {
  return (
    <div
      className={cn("shrink-0 overflow-hidden rounded-full", className)}
      aria-hidden="true"
    >
      <Avatar
        name={name}
        size={size}
        variant={WHISPER_AVATAR_VARIANT}
        colors={[...WHISPER_AVATAR_COLORS]}
      />
    </div>
  );
}
