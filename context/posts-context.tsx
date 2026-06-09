"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { posts as initialPosts } from "@/data/posts";
import { getUniqueCategories, normalizeCategory } from "@/lib/category";
import type { Post, PostCategory } from "@/types/post";

interface PostsContextValue {
  posts: Post[];
  categories: string[];
  addPost: (content: string, category: PostCategory) => void;
}

const PostsContext = createContext<PostsContextValue | null>(null);

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);

  const categories = useMemo(
    () => getUniqueCategories(posts.map((p) => p.category)),
    [posts]
  );

  const addPost = useCallback((content: string, category: PostCategory) => {
    const newPost: Post = {
      id: `post-${Date.now()}`,
      content: content.trim(),
      category: normalizeCategory(category),
      timestamp: new Date().toISOString(),
    };
    setPosts((prev) => [newPost, ...prev]);
  }, []);

  const value = useMemo(
    () => ({ posts, categories, addPost }),
    [posts, categories, addPost]
  );

  return (
    <PostsContext.Provider value={value}>{children}</PostsContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error("usePosts must be used within a PostsProvider");
  }
  return context;
}
