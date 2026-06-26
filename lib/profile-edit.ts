import {
  COMPLETE_PROFILE_THEMES,
  ONBOARDING_THEMES,
} from "@/data/onboarding-themes";
import type {
  OnboardingProfile,
  OnboardingQuestion,
  ProfileEditTheme,
} from "@/types/onboarding-profile";
import type { Profile } from "@/types/profile";

export function getProfileEditThemes(): ProfileEditTheme[] {
  const onboardingThemes = ONBOARDING_THEMES.map((theme) => ({
    ...theme,
    questions: theme.questions.filter((question) => question.id !== "username"),
  }));

  return [...onboardingThemes, ...COMPLETE_PROFILE_THEMES];
}

export function profileToOnboardingProfile(profile: Profile): OnboardingProfile {
  const answers = profile.onboarding_answers ?? {};

  return {
    username: profile.username,
    ageRange: profile.age_range,
    gender: profile.gender,
    genderCustom: profile.gender_custom ?? "",
    country: profile.country,
    bio: profile.bio,
    introLine: answers.introLine ?? profile.bio,
    values: answers.values ?? [],
    impact: answers.impact ?? "",
    topics: answers.topics ?? [],
    hobbies: answers.hobbies ?? "",
    communicationStyles: answers.communicationStyles ?? [],
    conversationMeaning: answers.conversationMeaning ?? "",
    conversationDepth: answers.conversationDepth ?? "",
    connectionGoals: answers.connectionGoals ?? [],
    greatConnection: answers.greatConnection ?? "",
    comfortableSharing: answers.comfortableSharing ?? [],
    displayPreference: answers.displayPreference ?? "",
    contentVisibility: answers.contentVisibility ?? "",
    surpriseFact: answers.surpriseFact ?? "",
    quote: answers.quote ?? "",
    superpower: answers.superpower ?? "",
  };
}

function isQuestionAnswered(
  question: OnboardingQuestion,
  profile: OnboardingProfile
): boolean {
  const value = profile[question.id];

  if (question.type === "multi") {
    return Array.isArray(value) && value.length > 0;
  }

  if (question.type === "text" || question.type === "textarea") {
    return typeof value === "string" && value.trim().length > 0;
  }

  if (question.type === "single") {
    return typeof value === "string" && value.trim().length > 0;
  }

  return false;
}

export function getPendingCompleteProfileQuestions(
  profile: OnboardingProfile
): OnboardingQuestion[] {
  const pending: OnboardingQuestion[] = [];

  for (const theme of COMPLETE_PROFILE_THEMES) {
    for (const question of theme.questions) {
      if (!isQuestionAnswered(question, profile)) {
        pending.push(question);
      }
    }
  }

  return pending;
}

export function getPendingCompleteProfileQuestionIds(
  profile: OnboardingProfile
): Set<string> {
  return new Set(
    getPendingCompleteProfileQuestions(profile).map((question) => question.id)
  );
}

export function isCompleteProfileTheme(theme: ProfileEditTheme): boolean {
  return COMPLETE_PROFILE_THEMES.some((item) => item.id === theme.id);
}

export function getProfileEditStepForThemeId(themeId: string): number {
  return getProfileEditThemes().findIndex((theme) => theme.id === themeId);
}
