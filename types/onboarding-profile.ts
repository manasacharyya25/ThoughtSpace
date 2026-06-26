/** Active onboarding flow (4 steps). */
export type OnboardingThemeId =
  | "basics"
  | "identity"
  | "values-interests"
  | "connect";

/** Illustrations + deferred complete-profile themes. */
export type OnboardingIllustrationId =
  | OnboardingThemeId
  | "values"
  | "interests"
  | "looking-for"
  | "connections"
  | "conversation-style"
  | "privacy"
  | "extras";

export type OnboardingQuestionType =
  | "text"
  | "textarea"
  | "single"
  | "multi";

export interface OnboardingProfile {
  username: string;
  ageRange: string;
  gender: string;
  genderCustom: string;
  country: string;
  bio: string;
  introLine: string;
  values: string[];
  impact: string;
  topics: string[];
  hobbies: string;
  communicationStyles: string[];
  conversationMeaning: string;
  conversationDepth: string;
  connectionGoals: string[];
  greatConnection: string;
  comfortableSharing: string[];
  displayPreference: string;
  contentVisibility: string;
  surpriseFact: string;
  quote: string;
  superpower: string;
}

export type OnboardingQuestionId = keyof OnboardingProfile;

export interface OnboardingQuestion {
  id: OnboardingQuestionId;
  label: string;
  hint?: string;
  type: OnboardingQuestionType;
  options?: readonly string[];
  maxSelections?: number;
  maxLength?: number;
  required?: boolean;
  placeholder?: string;
  rows?: number;
}

export interface OnboardingTheme {
  id: OnboardingThemeId;
  title: string;
  subtitle: string;
  whyWeAsk: string;
  illustration: OnboardingIllustrationId;
  skippable?: boolean;
  questions: OnboardingQuestion[];
}

/** Deferred to a future "Complete profile" flow — not shown during onboarding. */
export type CompleteProfileThemeId =
  | "connections"
  | "conversation-style"
  | "extras";

export interface CompleteProfileTheme {
  id: CompleteProfileThemeId;
  title: string;
  subtitle: string;
  whyWeAsk: string;
  illustration: OnboardingIllustrationId;
  questions: OnboardingQuestion[];
}

/** Shared shape for onboarding and complete-profile steps. */
export type ProfileEditTheme = OnboardingTheme | CompleteProfileTheme;

