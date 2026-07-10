import type { SupabaseClient } from "@supabase/supabase-js";
import type { NewsletterRow } from "@/types/newsletter";

const NEWSLETTER_SELECT =
  "id, issue_num, status, publish_at, state, created_at, updated_at";

export async function getPublishedNewsletterByIssueNum(
  supabase: SupabaseClient,
  issueNum: string
): Promise<{ data: NewsletterRow | null; error: Error | null }> {
  const { data, error } = await supabase
    .from("newsletters")
    .select(NEWSLETTER_SELECT)
    .eq("issue_num", issueNum)
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
    .select(NEWSLETTER_SELECT)
    .eq("status", "published")
    .order("updated_at", { ascending: false });

  if (error) {
    return { data: [], error: new Error(error.message) };
  }

  return { data: (data as NewsletterRow[] | null) ?? [], error: null };
}
