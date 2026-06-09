"use client";

import { PostsProvider } from "@/context/posts-context";

export function ShellProviders({ children }: { children: React.ReactNode }) {
  return <PostsProvider>{children}</PostsProvider>;
}
