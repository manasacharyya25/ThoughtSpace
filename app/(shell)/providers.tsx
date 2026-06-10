"use client";

import { ResponseModal } from "@/components/response";
import { InboxProvider } from "@/context/inbox-context";
import { PostsProvider } from "@/context/posts-context";
import { ResponsesProvider } from "@/context/responses-context";

export function ShellProviders({ children }: { children: React.ReactNode }) {
  return (
    <PostsProvider>
      <ResponsesProvider>
        <InboxProvider>
          {children}
          <ResponseModal />
        </InboxProvider>
      </ResponsesProvider>
    </PostsProvider>
  );
}
