"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getUniqueCategories } from "@/lib/category";
import { useTrialOptional } from "@/context/trial-context";
import { createClient } from "@/lib/supabase/client";
import { createPost, listPosts } from "@/lib/supabase/posts";
import type { Post, PostCategory } from "@/types/post";

interface PostsContextValue {
  posts: Post[];
  categories: string[];
  loading: boolean;
  error: string | null;
  addPost: (content: string, category: PostCategory) => Promise<Post>;
  refreshPosts: () => Promise<void>;
  bumpResponseCount: (postId: string) => void;
}

const PostsContext = createContext<PostsContextValue | null>(null);

export function PostsProvider({ children }: { children: ReactNode }) {
  const trial = useTrialOptional();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshPosts = useCallback(async () => {
    const supabase = createClient();
    const { data, error: fetchError } = await listPosts(supabase);

    if (fetchError) {
      setError(fetchError.message);
      return;
    }

    setPosts(data);
    setError(null);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data, error: fetchError } = await listPosts(supabase);

      if (cancelled) return;

      if (fetchError) {
        setError(fetchError.message);
        setPosts([]);
      } else {
        setPosts(data);
        setError(null);
      }
      setLoading(false);
    };

    load();

    return () => {
      cancelled = true;
    };
  }, []);

  const categories = useMemo(
    () => getUniqueCategories(posts.map((p) => p.category)),
    [posts]
  );

  const bumpResponseCount = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? { ...post, response_count: post.response_count + 1 }
          : post
      )
    );
  }, []);

  const addPost = useCallback(
    async (content: string, category: PostCategory) => {
      if (trial && !trial.guardCast()) {
        throw new Error("Guest cast limit reached.");
      }

      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error("You must be signed in to post.");
      }

      const { data, error: insertError } = await createPost(
        supabase,
        user.id,
        content,
        category
      );

      if (insertError || !data) {
        throw insertError ?? new Error("Could not create post.");
      }

      setPosts((prev) => [data, ...prev]);
      setError(null);
      trial?.notifyCastSuccess();
      return data;
    },
    [trial]
  );

  const value = useMemo(
    () => ({
      posts,
      categories,
      loading,
      error,
      addPost,
      refreshPosts,
      bumpResponseCount,
    }),
    [posts, categories, loading, error, addPost, refreshPosts, bumpResponseCount]
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
