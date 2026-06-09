export const ageRanges = [
  "18–24",
  "25–34",
  "35–44",
  "45–54",
  "55+",
] as const;

export const countries = [
  "United States",
  "United Kingdom",
  "Canada",
  "Australia",
  "Germany",
  "France",
  "India",
  "Japan",
  "Brazil",
  "Mexico",
  "Netherlands",
  "Sweden",
  "Spain",
  "Italy",
  "South Korea",
  "Singapore",
  "New Zealand",
  "Ireland",
  "Portugal",
  "Other",
] as const;

export const onboardingStepMeta = [
  {
    id: "username" as const,
    title: "Choose a username",
    description: "How you'll appear in conversations — no photos needed.",
  },
  {
    id: "age" as const,
    title: "Your age range",
    description: "Helps us connect you with people in a similar life stage.",
  },
  {
    id: "country" as const,
    title: "Where are you based?",
    description: "Optional context for meaningful connections.",
  },
  {
    id: "bio" as const,
    title: "A few words about you",
    description: "Share what you're curious about or looking for.",
  },
];
