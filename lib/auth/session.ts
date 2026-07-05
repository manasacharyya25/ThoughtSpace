import type { User } from "@supabase/supabase-js";

export function isGuestUser(user: User | null | undefined): boolean {
  return Boolean(user?.is_anonymous);
}

export function isRegisteredUser(user: User | null | undefined): boolean {
  return Boolean(user && !user.is_anonymous);
}
