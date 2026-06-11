import { GENDER_SELF_DESCRIBE } from "@/data/onboarding-options";
import type { OnboardingProfile } from "@/types/onboarding-profile";
import type { Profile, ProfileRow } from "@/types/profile";

export function mapProfileRow(row: ProfileRow): Profile {
  return {
    id: row.id,
    username: row.username,
    age_range: row.age_range,
    gender: row.gender,
    gender_custom: row.gender_custom,
    country: row.country,
    bio: row.bio,
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
}

export function onboardingToProfileInsert(
  userId: string,
  profile: OnboardingProfile
) {
  return {
    id: userId,
    username: profile.username.trim().toLowerCase(),
    age_range: profile.ageRange,
    gender: profile.gender,
    gender_custom:
      profile.gender === GENDER_SELF_DESCRIBE
        ? profile.genderCustom.trim()
        : null,
    country: profile.country,
    bio: profile.bio.trim(),
  };
}

export function getProfileGenderLabel(profile: Profile): string {
  if (profile.gender_custom) return profile.gender_custom;
  return profile.gender;
}
