import type { SupabaseClient } from "@supabase/supabase-js";
import { mapPostRow, toPostInsert } from "@/lib/post-mapper";
import type { Post, PostRow } from "@/types/post";

const POST_WITH_AUTHOR_SELECT = `
  *,
  author:profiles (
    username,
    gender,
    gender_custom
  )
`;

export async function getPostById(
  supabase: SupabaseClient,
  postId: string
): Promise<{ data: Post | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("posts")
    .select(POST_WITH_AUTHOR_SELECT)
    .eq("id", postId)
    .maybeSingle();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  if (!data) {
    return { data: null, error: null };
  }

  return { data: mapPostRow(data as PostRow), error: null };
}

export async function listPosts(supabase: SupabaseClient): Promise<{
  data: Post[];
  error: Error | null;
}> {
  const { data, error } = await supabase
    .from("posts")
    .select(POST_WITH_AUTHOR_SELECT)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [], error: new Error(error.message) };
  }

  return {
    data: (data as PostRow[]).map(mapPostRow),
    error: null,
  };
}

export async function createPost(
  supabase: SupabaseClient,
  authorId: string,
  content: string,
  category: string
): Promise<{ data: Post | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("posts")
    .insert(toPostInsert(authorId, content, category))
    .select(POST_WITH_AUTHOR_SELECT)
    .single();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  return { data: mapPostRow(data as PostRow), error: null };
}
