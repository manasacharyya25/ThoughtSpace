import { getOnboardingAnswers } from "@/data/onboarding-themes";
import { GENDER_SELF_DESCRIBE } from "@/data/onboarding-options";
import type { OnboardingProfile } from "@/types/onboarding-profile";
import type { OnboardingAnswers, Profile, ProfileRow } from "@/types/profile";

function asStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter(
    (item): item is string => typeof item === "string" && item.trim().length > 0
  );
}

function asString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : undefined;
}

export function parseOnboardingAnswers(
  raw: ProfileRow["onboarding_answers"]
): OnboardingAnswers {
  const answers = raw ?? {};

  return {
    introLine: asString(answers.introLine),
    values: asStringArray(answers.values),
    impact: asString(answers.impact),
    topics: asStringArray(answers.topics),
    hobbies: asString(answers.hobbies),
    communicationStyles: asStringArray(answers.communicationStyles),
    conversationMeaning: asString(answers.conversationMeaning),
    conversationDepth: asString(answers.conversationDepth),
    connectionGoals: asStringArray(answers.connectionGoals),
    greatConnection: asString(answers.greatConnection),
    comfortableSharing: asStringArray(answers.comfortableSharing),
    displayPreference: asString(answers.displayPreference),
    contentVisibility: asString(answers.contentVisibility),
    surpriseFact: asString(answers.surpriseFact),
    quote: asString(answers.quote),
    superpower: asString(answers.superpower),
  };
}

export function hasCompleteProfileAnswers(answers: OnboardingAnswers): boolean {
  return !!(
    answers.impact ||
    answers.hobbies ||
    answers.conversationMeaning ||
    answers.conversationDepth ||
    answers.connectionGoals?.length ||
    answers.greatConnection ||
    answers.comfortableSharing?.length ||
    answers.displayPreference ||
    answers.contentVisibility ||
    answers.surpriseFact ||
    answers.quote ||
    answers.superpower
  );
}

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
    onboarding_answers: parseOnboardingAnswers(row.onboarding_answers),
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
    onboarding_answers: getOnboardingAnswers(profile),
  };
}

export function getProfileGenderLabel(profile: Profile): string {
  if (profile.gender_custom) return profile.gender_custom;
  return profile.gender;
}
