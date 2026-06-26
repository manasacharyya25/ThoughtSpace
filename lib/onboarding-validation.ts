import { GENDER_SELF_DESCRIBE } from "@/data/onboarding-options";
import { ONBOARDING_THEMES } from "@/data/onboarding-themes";
import type {
  OnboardingProfile,
  OnboardingQuestion,
  OnboardingThemeId,
  ProfileEditTheme,
} from "@/types/onboarding-profile";

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
export const BIO_MAX_LENGTH = 150;
export const INTRO_MAX_LENGTH = 150;

function getStringValue(profile: OnboardingProfile, id: OnboardingQuestion["id"]) {
  const value = profile[id];
  return typeof value === "string" ? value.trim() : "";
}

function getArrayValue(profile: OnboardingProfile, id: OnboardingQuestion["id"]) {
  const value = profile[id];
  return Array.isArray(value) ? value : [];
}

export function validateQuestion(
  question: OnboardingQuestion,
  profile: OnboardingProfile
): string | undefined {
  if (question.type === "text" || question.type === "textarea") {
    const value = getStringValue(profile, question.id);

    if (question.required && !value) {
      return "This field is required.";
    }

    if (question.id === "username" && value) {
      if (!USERNAME_REGEX.test(value)) {
        return "Use 3–20 characters: letters, numbers, underscores.";
      }
    }

    if (question.id === "introLine" && value && value.length < 10) {
      return "Use at least 10 characters.";
    }

    if (question.maxLength && value.length > question.maxLength) {
      return `Keep it under ${question.maxLength} characters.`;
    }

    return undefined;
  }

  if (question.type === "single") {
    const value = getStringValue(profile, question.id);
    if (question.required && !value) {
      return "Choose one option to continue.";
    }

    if (
      question.id === "gender" &&
      value === GENDER_SELF_DESCRIBE &&
      !profile.genderCustom.trim()
    ) {
      return "Tell us how you identify.";
    }

    return undefined;
  }

  if (question.type === "multi") {
    const values = getArrayValue(profile, question.id);
    if (question.required && values.length === 0) {
      return "Choose at least one option.";
    }
    return undefined;
  }

  return undefined;
}

export function validateThemeStep(
  themeId: OnboardingThemeId,
  profile: OnboardingProfile
): string | undefined {
  const theme = ONBOARDING_THEMES.find((item) => item.id === themeId);
  if (!theme) return undefined;

  for (const question of theme.questions) {
    const error = validateQuestion(question, profile);
    if (error) return error;
  }

  return undefined;
}

export function validateProfileEditTheme(
  theme: ProfileEditTheme,
  profile: OnboardingProfile
): string | undefined {
  for (const question of theme.questions) {
    const error = validateQuestion(question, profile);
    if (error) return error;
  }

  return undefined;
}

export function prepareProfileForSave(
  profile: OnboardingProfile
): OnboardingProfile {
  return {
    ...profile,
    username: profile.username.trim().toLowerCase(),
    bio: profile.introLine.trim() || profile.bio.trim(),
    genderCustom:
      profile.gender === GENDER_SELF_DESCRIBE
        ? profile.genderCustom.trim()
        : "",
  };
}
