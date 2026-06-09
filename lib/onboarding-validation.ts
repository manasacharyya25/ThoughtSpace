import type { OnboardingProfile, OnboardingStepId } from "@/types/onboarding-profile";

const USERNAME_REGEX = /^[a-zA-Z0-9_]{3,20}$/;
export const BIO_MAX_LENGTH = 150;

export function validateOnboardingStep(
  step: OnboardingStepId,
  profile: OnboardingProfile
): string | undefined {
  switch (step) {
    case "username": {
      const value = profile.username.trim();
      if (!value) return "Username is required.";
      if (!USERNAME_REGEX.test(value))
        return "Use 3–20 characters: letters, numbers, underscores.";
      return undefined;
    }
    case "age":
      if (!profile.ageRange) return "Select an age range.";
      return undefined;
    case "country":
      if (!profile.country) return "Select a country.";
      return undefined;
    case "bio": {
      const value = profile.bio.trim();
      if (!value) return "Write a short bio to continue.";
      if (value.length < 10) return "Bio must be at least 10 characters.";
      if (value.length > BIO_MAX_LENGTH)
        return `Bio must be under ${BIO_MAX_LENGTH} characters.`;
      return undefined;
    }
    default:
      return undefined;
  }
}
