import type { SupabaseClient } from "@supabase/supabase-js";
import type { NewsletterRow } from "@/types/newsletter";

export async function getPublishedNewsletter(
  supabase: SupabaseClient,
  issueId: string
): Promise<{ data: NewsletterRow | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("newsletters")
    .select("id, status, publish_at, state, created_at, updated_at")
    .eq("id", issueId)
    .eq("status", "published")
    .maybeSingle();

  if (error) {
    return { data: null, error: new Error(error.message) };
  }

  if (!data) {
    return { data: null, error: null };
  }

  return { data: data as NewsletterRow, error: null };
}

export async function listPublishedNewsletters(
  supabase: SupabaseClient
): Promise<{ data: NewsletterRow[]; error: Error | null }> {
  const { data, error } = await supabase
    .from("newsletters")
    .select("id, status, publish_at, state, created_at, updated_at")
    .eq("status", "published")
    .order("updated_at", { ascending: false });

  if (error) {
    return { data: [], error: new Error(error.message) };
  }

  return { data: (data as NewsletterRow[] | null) ?? [], error: null };
}
