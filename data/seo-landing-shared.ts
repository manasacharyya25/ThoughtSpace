export type SeoFaqItem = {
  question: string;
  answer: string;
};

export type SeoWhyChooseItem = {
  title: string;
  body: string;
};

export type SeoHowItWorksStep = {
  title: string;
  body: string;
};

export const SEO_LANDING_SHARED = {
  whyChoose: {
    title: "Why Choose ThoughtSpace?",
    items: [
      {
        title: "Conversations Instead of Content",
        body: "Modern social media encourages broadcasting. ThoughtSpace encourages listening.",
      },
      {
        title: "Stay Anonymous",
        body: "No public profile, no follower count, and no pressure to present a perfect version of yourself.",
      },
      {
        title: "One-to-One Connections",
        body: "Every conversation happens between two people, making it easier to build trust and have deeper discussions.",
      },
      {
        title: "Meaningful Matches",
        body: "Instead of matching based on appearance or popularity, ThoughtSpace connects people through shared thoughts, questions, and interests.",
      },
      {
        title: "A Calmer Social Experience",
        body: "Without feeds or endless notifications, conversations can happen naturally and at your own pace.",
      },
    ] satisfies SeoWhyChooseItem[],
  },
  howItWorks: {
    title: "How It Works",
    steps: [
      {
        title: "Share What's On Your Mind",
        body: "Start with a thought, question, or feeling you'd like to talk about.",
      },
      {
        title: "Get Matched",
        body: "ThoughtSpace introduces you to another anonymous person looking for a meaningful conversation.",
      },
      {
        title: "Talk Freely",
        body: "Have an honest one-to-one discussion without worrying about likes, followers, or public profiles.",
      },
      {
        title: "Continue If You Connect",
        body: "If both people enjoy the conversation, it can continue naturally without the pressure of traditional social media.",
      },
    ] satisfies SeoHowItWorksStep[],
  },
  keyBenefits: {
    title: "Key Benefits",
    items: [
      "Anonymous conversations",
      "One-to-one matching",
      "No profile creation",
      "No follower counts",
      "No phone number required",
      "Thoughtful conversation prompts",
      "Privacy-first design",
      "Calm, distraction-free interface",
    ],
  },
  faq: {
    title: "Frequently Asked Questions",
    items: [
      {
        question: "Is ThoughtSpace completely anonymous?",
        answer:
          "Yes. You don't need a public profile to start meaningful conversations.",
      },
      {
        question: "Do I need to sign up?",
        answer:
          "You can start without the usual profile-building experience.",
      },
      {
        question: "Is anonymous chat safe?",
        answer:
          "ThoughtSpace is designed to encourage respectful conversations while reducing many of the pressures found on traditional social platforms.",
      },
      {
        question: "Can I continue talking to someone?",
        answer:
          "Yes. If both people want to continue the conversation, they can.",
      },
      {
        question: "Is it free?",
        answer: "Yes. You can begin using ThoughtSpace for free.",
      },
    ] satisfies SeoFaqItem[],
  },
  finalCta: {
    title: "Ready to Have a Real Conversation?",
    lines: [
      "Leave profiles and followers behind.",
      "Discover thoughtful one-to-one conversations where your ideas matter more than your identity.",
    ],
  },
} as const;
