"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

export interface ReactionNotification {
  id: string;
  emoji: string;
  whisperText: string;
}

interface ReactionNotificationToastProps {
  notification: ReactionNotification;
  onDone: () => void;
}

const VISIBLE_MS = 4200;
const EXIT_MS = 350;

export function ReactionNotificationToast({
  notification,
  onDone,
}: ReactionNotificationToastProps) {
  const [exiting, setExiting] = useState(false);

  useEffect(() => {
    const exitTimer = setTimeout(() => setExiting(true), VISIBLE_MS);
    const doneTimer = setTimeout(() => onDone(), VISIBLE_MS + EXIT_MS);

    return () => {
      clearTimeout(exitTimer);
      clearTimeout(doneTimer);
    };
  }, [notification.id, onDone]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed bottom-6 right-6 z-[60] flex max-w-[min(100vw-3rem,360px)] items-center gap-3 rounded-full border border-[#2F9CFA] bg-[#EBF5FF] px-4 py-2.5 shadow-[0_12px_32px_-8px_rgba(47,156,250,0.22)]",
        exiting ? "reaction-toast-exit" : "reaction-toast-enter"
      )}
    >
      <span className="shrink-0 text-xl leading-none" aria-hidden="true">
        {notification.emoji}
      </span>
      <p className="truncate text-sm font-medium text-[#1C1D1E]/80">
        {notification.whisperText}
      </p>
    </div>
  );
}
