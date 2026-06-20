export interface Profile {
  id: string;
  username: string;
  age_range: string;
  gender: string;
  gender_custom: string | null;
  country: string;
  bio: string;
  created_at: string;
  updated_at: string;
  onboarding_answers?: OnboardingAnswers;
}

export interface OnboardingAnswers {
  introLine?: string;
  values?: string[];
  impact?: string;
  topics?: string[];
  hobbies?: string;
  communicationStyles?: string[];
  conversationMeaning?: string;
  conversationDepth?: string;
  connectionGoals?: string[];
  greatConnection?: string;
  comfortableSharing?: string[];
  displayPreference?: string;
  contentVisibility?: string;
  surpriseFact?: string;
  quote?: string;
  superpower?: string;
}

export interface ProfileRow {
  id: string;
  username: string;
  age_range: string;
  gender: string;
  gender_custom: string | null;
  country: string;
  bio: string;
  created_at: string;
  updated_at: string;
  onboarding_answers?: OnboardingAnswers | Record<string, unknown> | null;
}
