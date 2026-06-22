import type { SupabaseClient, User } from "@supabase/supabase-js";

export function isGuestUser(user: User | null | undefined): boolean {
  return Boolean(user?.is_anonymous);
}

export function isRegisteredUser(user: User | null | undefined): boolean {
  return Boolean(user && !user.is_anonymous);
}

export async function ensureAnonymousSession(supabase: SupabaseClient) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return { user, error: null as Error | null };
  }

  const { data, error } = await supabase.auth.signInAnonymously();

  if (error) {
    return { user: null, error: new Error(error.message) };
  }

  return { user: data.user, error: null as Error | null };
}
