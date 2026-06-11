import type { SupabaseClient } from "@supabase/supabase-js";
import { mapProfileRow, onboardingToProfileInsert } from "@/lib/profile-mapper";
import type { OnboardingProfile } from "@/types/onboarding-profile";
import type { Profile, ProfileRow } from "@/types/profile";

export function isUsernameTakenError(error: { code?: string } | null): boolean {
  return error?.code === "23505";
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
  profile: OnboardingProfile
) {
  const payload = onboardingToProfileInsert(userId, profile);

  const { data, error } = await supabase
    .from("profiles")
    .upsert(payload, { onConflict: "id" })
    .select("*")
    .single();

  return { data: data ? mapProfileRow(data as ProfileRow) : null, error };
}
