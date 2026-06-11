import type { User } from "@supabase/supabase-js";

export function getUserDisplayName(user: User): string {
  const meta = user.user_metadata;
  if (typeof meta?.full_name === "string" && meta.full_name.trim()) {
    return meta.full_name.trim();
  }
  if (typeof meta?.name === "string" && meta.name.trim()) {
    return meta.name.trim();
  }
  if (user.email) {
    return user.email.split("@")[0] ?? "User";
  }
  return "User";
}

export function getUserInitial(user: User): string {
  const name = getUserDisplayName(user);
  return name.charAt(0).toUpperCase();
}
