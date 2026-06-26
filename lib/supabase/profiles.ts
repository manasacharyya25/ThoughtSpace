import type { SupabaseClient } from "@supabase/supabase-js";
import { isGuestUser } from "@/lib/auth/session";
import { mapProfileRow, onboardingToProfileInsert, onboardingToProfileUpdate } from "@/lib/profile-mapper";
import type { OnboardingProfile } from "@/types/onboarding-profile";
import type { Profile, ProfileRow } from "@/types/profile";

export function isUsernameTakenError(error: { code?: string } | null): boolean {
  return error?.code === "23505";
}

export async function isUsernameTaken(
  supabase: SupabaseClient,
  username: string,
  options?: { excludeUserId?: string }
): Promise<boolean> {
  const normalized = username.trim().toLowerCase();
  if (!normalized) return false;

  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", normalized)
    .maybeSingle();

  if (error || !data) return false;
  if (options?.excludeUserId && data.id === options.excludeUserId) return false;
  return true;
}

export async function hasProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("id", userId)
    .maybeSingle();

  if (error) return false;
  return !!data;
}

export async function getProfileByUserId(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) return null;
  return mapProfileRow(data as ProfileRow);
}

export async function createProfileFromOnboarding(
  supabase: SupabaseClient,
  userId: string,
  profile: OnboardingProfile,
  options?: { isGuest?: boolean }
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isGuest = options?.isGuest ?? isGuestUser(user);
  const payload = onboardingToProfileInsert(
    userId,
    profile,
    isGuest ? "anonymous" : "registered"
  );

  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select("*")
    .single();

  return { data: data ? mapProfileRow(data as ProfileRow) : null, error };
}

export async function markProfileRegistered(
  supabase: SupabaseClient,
  userId: string
) {
  const { error } = await supabase
    .from("profiles")
    .update({ account_status: "registered" })
    .eq("id", userId)
    .eq("account_status", "anonymous");

  return { error: error ? new Error(error.message) : null };
}

export async function updateProfileFromOnboarding(
  supabase: SupabaseClient,
  userId: string,
  profile: OnboardingProfile
) {
  const payload = onboardingToProfileUpdate(profile);

  const { data, error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", userId)
    .select("*")
    .single();

  return { data: data ? mapProfileRow(data as ProfileRow) : null, error };
}
