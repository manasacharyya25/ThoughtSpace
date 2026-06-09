export interface OnboardingProfile {
  username: string;
  ageRange: string;
  country: string;
  bio: string;
}

export type OnboardingStepId = "username" | "age" | "country" | "bio";
