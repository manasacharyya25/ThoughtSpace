export interface OnboardingProfile {
  username: string;
  ageRange: string;
  gender: string;
  genderCustom: string;
  country: string;
  bio: string;
}

export type OnboardingStepId =
  | "username"
  | "age"
  | "gender"
  | "country"
  | "bio";
