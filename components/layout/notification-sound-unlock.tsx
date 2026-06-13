"use client";

import { useEffect } from "react";
import { unlockNotificationSound } from "@/lib/notification-sound";

export function NotificationSoundUnlock() {
  useEffect(() => {
    const unlock = () => unlockNotificationSound();

    window.addEventListener("pointerdown", unlock, { once: true });
    window.addEventListener("keydown", unlock, { once: true });

    return () => {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
    };
  }, []);

  return null;
}
