import type { SupabaseClient } from "@supabase/supabase-js";
import { mapPostReactionRow } from "@/lib/post-reaction-mapper";
import type { PostReaction, PostReactionRow } from "@/types/post-reaction";

export async function listReactionsForPosts(
  supabase: SupabaseClient,
  postIds: string[]
): Promise<{ data: PostReaction[]; error: Error | null }> {
  if (postIds.length === 0) {
    return { data: [], error: null };
  }

  const { data, error } = await supabase
    .from("post_reactions")
    .select("*")
    .in("post_id", postIds)
    .order("created_at", { ascending: true });

  if (error) {
    return { data: [], error: new Error(error.message) };
  }

  return {
    data: (data as PostReactionRow[]).map(mapPostReactionRow),
    error: null,
  };
}

export async function togglePostReaction(
  supabase: SupabaseClient,
  postId: string,
  userId: string,
  emoji: string
): Promise<{ data: PostReaction | null; error: Error | null; removed: boolean }> {
  const { data: existing, error: fetchError } = await supabase
    .from("post_reactions")
    .select("*")
    .eq("post_id", postId)
    .eq("user_id", userId)
    .maybeSingle();

  if (fetchError) {
    return { data: null, error: new Error(fetchError.message), removed: false };
  }

  if (existing) {
    const row = existing as PostReactionRow;
    if (row.emoji === emoji) {
      const { error: deleteError } = await supabase
        .from("post_reactions")
        .delete()
        .eq("id", row.id);

      if (deleteError) {
        return { data: null, error: new Error(deleteError.message), removed: false };
      }

      return { data: null, error: null, removed: true };
    }

    const { data: updated, error: updateError } = await supabase
      .from("post_reactions")
      .update({ emoji })
      .eq("id", row.id)
      .select("*")
      .single();

    if (updateError) {
      return { data: null, error: new Error(updateError.message), removed: false };
    }

    return {
      data: mapPostReactionRow(updated as PostReactionRow),
      error: null,
      removed: false,
    };
  }

  const { data: inserted, error: insertError } = await supabase
    .from("post_reactions")
    .insert({ post_id: postId, user_id: userId, emoji })
    .select("*")
    .single();

  if (insertError) {
    return { data: null, error: new Error(insertError.message), removed: false };
  }

  return {
    data: mapPostReactionRow(inserted as PostReactionRow),
    error: null,
    removed: false,
  };
}
