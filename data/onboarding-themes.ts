import {
  ageRanges,
  countries,
  genderOptions,
} from "@/data/onboarding-options";
import type {
  CompleteProfileTheme,
  OnboardingProfile,
  OnboardingQuestionId,
  OnboardingTheme,
} from "@/types/onboarding-profile";

/** Fields collected during the 4-step onboarding flow. */
export const ONBOARDING_FIELD_IDS = [
  "username",
  "introLine",
  "ageRange",
  "gender",
  "genderCustom",
  "country",
  "values",
  "topics",
  "communicationStyles",
] as const satisfies readonly OnboardingQuestionId[];

/** Fields left empty until a future "Complete profile" flow. */
export const COMPLETE_PROFILE_FIELD_IDS = [
  "impact",
  "hobbies",
  "conversationMeaning",
  "conversationDepth",
  "connectionGoals",
  "greatConnection",
  "comfortableSharing",
  "displayPreference",
  "contentVisibility",
  "surpriseFact",
  "quote",
  "superpower",
] as const satisfies readonly OnboardingQuestionId[];

const valueOptions = [
  "Kindness",
  "Growth",
  "Creativity",
  "Integrity",
  "Freedom",
  "Curiosity",
  "Empathy",
  "Community",
  "Other",
] as const;

const topicOptions = [
  "Philosophy",
  "Science",
  "Books",
  "Technology",
  "Art",
  "Psychology",
  "Wellness",
  "Travel",
  "Society",
] as const;

const communicationStyleOptions = [
  "Thoughtful & deep",
  "Open & honest",
  "Curious & asking",
  "Supportive & kind",
  "Playful & fun",
  "Reflective & calm",
] as const;

export const ONBOARDING_THEMES: OnboardingTheme[] = [
  {
    id: "basics",
    title: "Getting started",
    subtitle: "Your name, a short bio, and age range.",
    whyWeAsk:
      "Helps create your basic profile and gives others a first impression.",
    illustration: "basics",
    questions: [
      {
        id: "username",
        label: "What should we call you?",
        hint: "This becomes your @username on ThoughtSpace.",
        type: "text",
        placeholder: "thoughtful_mind",
        required: true,
      },
      {
        id: "introLine",
        label: "How would you like to introduce yourself in a line?",
        type: "text",
        placeholder: "Curious mind, coffee lover, book explorer.",
        required: true,
        maxLength: 150,
      },
      {
        id: "ageRange",
        label: "Your age range",
        type: "single",
        options: ageRanges,
        required: true,
      },
    ],
  },
  {
    id: "identity",
    title: "About you",
    subtitle: "Where you're from and how you identify.",
    whyWeAsk:
      "Optional context that helps us suggest meaningful connections.",
    illustration: "identity",
    questions: [
      {
        id: "country",
        label: "Where are you from?",
        hint: "Start typing to search",
        type: "single",
        options: countries,
        required: true,
      },
      {
        id: "gender",
        label: "How do you identify?",
        type: "single",
        options: genderOptions,
        required: true,
      },
    ],
  },
  {
    id: "values-interests",
    title: "What matters to you",
    subtitle: "Values you live by and topics you're curious about.",
    whyWeAsk:
      "Helps us match you with people who share your outlook and interests.",
    illustration: "values",
    questions: [
      {
        id: "values",
        label: "Which values do you live by?",
        hint: "Pick up to 3",
        type: "multi",
        maxSelections: 3,
        options: valueOptions,
        required: true,
      },
      {
        id: "topics",
        label: "Which of these are you curious to explore more?",
        hint: "Pick up to 5",
        type: "multi",
        maxSelections: 5,
        options: topicOptions,
        required: true,
      },
    ],
  },
  {
    id: "connect",
    title: "How you connect",
    subtitle: "Your communication style in conversations.",
    whyWeAsk:
      "Understanding your style helps us create better conversational matches.",
    illustration: "connect",
    questions: [
      {
        id: "communicationStyles",
        label: "How do you usually express yourself in conversations?",
        hint: "Pick up to 3",
        type: "multi",
        maxSelections: 3,
        options: communicationStyleOptions,
        required: true,
      },
    ],
  },
];

/**
 * Question sets for a future "Complete profile" screen.
 * Not shown during onboarding — see COMPLETE_PROFILE_FIELD_IDS.
 */
export const COMPLETE_PROFILE_THEMES: CompleteProfileTheme[] = [
  {
    id: "connections",
    title: "What you're looking for",
    subtitle:
      "What kind of connections are you hoping to find? What would a great connection look like for you?",
    whyWeAsk:
      "Sets the right expectations and helps us recommend the right people and spaces.",
    illustration: "looking-for",
    questions: [
      {
        id: "connectionGoals",
        label: "What kind of connections are you hoping to find?",
        type: "multi",
        maxSelections: 4,
        options: [
          "Meaningful friendships",
          "Deep conversations",
          "Learning & growth",
          "Shared interests",
          "Support & encouragement",
          "Other",
        ],
      },
      {
        id: "greatConnection",
        label: "What would a great connection look like for you?",
        type: "textarea",
        placeholder: "Describe your ideal connection…",
        rows: 3,
        maxLength: 200,
      },
    ],
  },
  {
    id: "conversation-style",
    title: "How you connect",
    subtitle:
      "Do you prefer deep dives or light chats? What hobbies or activities energize you?",
    whyWeAsk:
      "Helps us understand your rhythm in conversation and what you like to talk about.",
    illustration: "connect",
    questions: [
      {
        id: "conversationDepth",
        label: "Do you prefer deep dives or light chats?",
        type: "single",
        options: ["Deep dives", "A bit of both", "Light chats"],
      },
      {
        id: "conversationMeaning",
        label: "What makes a conversation meaningful to you?",
        type: "textarea",
        placeholder: "In your own words…",
        rows: 2,
        maxLength: 200,
      },
      {
        id: "hobbies",
        label: "What hobbies or activities energize you?",
        type: "text",
        placeholder: "Writing, hiking, film, music…",
        maxLength: 120,
      },
    ],
  },
  {
    id: "extras",
    title: "The Little Extras",
    subtitle: "Fun and light questions to personalize your experience.",
    whyWeAsk:
      "Helps your personality shine and makes connections more memorable.",
    illustration: "extras",
    questions: [
      {
        id: "surpriseFact",
        label: "What's something people would be surprised to know about you?",
        type: "text",
        placeholder: "Surprise us…",
        maxLength: 120,
      },
      {
        id: "quote",
        label: "What's a quote or idea you connect with?",
        type: "text",
        placeholder: "A line that stays with you…",
        maxLength: 120,
      },
      {
        id: "superpower",
        label: "If you could have any superpower, what would it be?",
        type: "text",
        placeholder: "One word or short phrase…",
        maxLength: 60,
      },
    ],
  },
];

export const initialOnboardingProfile: OnboardingProfile = {
  username: "",
  ageRange: "",
  gender: "",
  genderCustom: "",
  country: "",
  bio: "",
  introLine: "",
  values: [],
  impact: "",
  topics: [],
  hobbies: "",
  communicationStyles: [],
  conversationMeaning: "",
  conversationDepth: "",
  connectionGoals: [],
  greatConnection: "",
  comfortableSharing: [],
  displayPreference: "",
  contentVisibility: "",
  surpriseFact: "",
  quote: "",
  superpower: "",
};

export function getOnboardingAnswers(profile: OnboardingProfile) {
  return {
    introLine: profile.introLine,
    values: profile.values,
    impact: profile.impact.trim(),
    topics: profile.topics,
    hobbies: profile.hobbies.trim(),
    communicationStyles: profile.communicationStyles,
    conversationMeaning: profile.conversationMeaning.trim(),
    conversationDepth: profile.conversationDepth,
    connectionGoals: profile.connectionGoals,
    greatConnection: profile.greatConnection.trim(),
    comfortableSharing: profile.comfortableSharing,
    displayPreference: profile.displayPreference,
    contentVisibility: profile.contentVisibility,
    surpriseFact: profile.surpriseFact.trim(),
    quote: profile.quote.trim(),
    superpower: profile.superpower.trim(),
  };
}
