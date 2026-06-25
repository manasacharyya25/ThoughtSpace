"use client";

import { ResponseModal } from "@/components/response";
import { ReactionNotifications } from "@/components/feed/reaction-notifications";
import { NotificationSoundUnlock } from "@/components/layout/notification-sound-unlock";
import { TrialProvider } from "@/context/trial-context";
import { InboxProvider } from "@/context/inbox-context";
import { PostsProvider } from "@/context/posts-context";
import { ResponsesProvider } from "@/context/responses-context";

export function ShellProviders({ children }: { children: React.ReactNode }) {
  return (
    <TrialProvider>
      <PostsProvider>
        <ResponsesProvider>
          <InboxProvider>
            {children}
            <ResponseModal />
            <ReactionNotifications />
            <NotificationSoundUnlock />
          </InboxProvider>
        </ResponsesProvider>
      </PostsProvider>
    </TrialProvider>
  );
}
