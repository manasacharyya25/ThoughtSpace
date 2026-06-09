"use client";

import { ResponseModal } from "@/components/response";
import { PostsProvider } from "@/context/posts-context";
import { ResponsesProvider } from "@/context/responses-context";

export function ShellProviders({ children }: { children: React.ReactNode }) {
  return (
    <PostsProvider>
      <ResponsesProvider>
        {children}
        <ResponseModal />
      </ResponsesProvider>
    </PostsProvider>
  );
}
