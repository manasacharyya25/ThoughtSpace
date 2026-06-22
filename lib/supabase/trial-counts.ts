import type { SupabaseClient } from "@supabase/supabase-js";

export async function getTrialUsageCounts(
  supabase: SupabaseClient,
  userId: string
): Promise<{ castCount: number; replyCount: number; error: Error | null }> {
  const [postsResult, responsesResult] = await Promise.all([
    supabase
      .from("posts")
      .select("id", { count: "exact", head: true })
      .eq("author_id", userId),
    supabase
      .from("responses")
      .select("id", { count: "exact", head: true })
      .eq("responder_id", userId),
  ]);

  if (postsResult.error) {
    return {
      castCount: 0,
      replyCount: 0,
      error: new Error(postsResult.error.message),
    };
  }

  if (responsesResult.error) {
    return {
      castCount: 0,
      replyCount: 0,
      error: new Error(responsesResult.error.message),
    };
  }

  return {
    castCount: postsResult.count ?? 0,
    replyCount: responsesResult.count ?? 0,
    error: null,
  };
}
