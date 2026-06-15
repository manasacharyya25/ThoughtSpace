export const whatToExpectItems = [
  {
    step: "01",
    title: "No profiles.",
    description:
      "No photos. No bios. No performance. You show up as what you think — not how you look.",
  },
  {
    step: "02",
    title: "No metrics.",
    description:
      "No like counts. No follower numbers. Nothing to optimize except the honesty of what you share.",
  },
  {
    step: "03",
    title: "No curation.",
    description:
      "No algorithm deciding who deserves to be seen. Thoughts surface because someone meant them.",
  },
] as const;

export const howItWorksSteps = [
  {
    step: "01",
    title: "Share a thought",
    description:
      "Post a question, idea, or feeling to the public feed. No photos, no filters — just what's on your mind.",
  },
  {
    step: "02",
    title: "Read the feed",
    description:
      "Browse thoughts from people who resonate. Discover minds through curiosity, not appearance.",
  },
  {
    step: "03",
    title: "Respond",
    description:
      "When a thought moves you, reach out with a real response. One person. One thread. No audience.",
  },
  {
    step: "04",
    title: "The thread begins",
    description:
      "If they accept, a private conversation opens. Every connection starts with substance.",
  },
] as const;

export const demoThought = {
  label: "A THOUGHT",
  content:
    "What's a belief you held as a child that turned out beautifully wrong?",
  responseLabel: "A RESPONSE",
  responsePreview: "That adults always knew what they were doing…",
};

export const demoConversation = {
  label: "A CONVERSATION",
  messages: [
  {
    from: "them",
    text: "That adults always knew what they were doing. Turns out we're all improvising.",
  },
  {
    from: "you",
    text: "Same. I think that's why honest conversations hit so hard now.",
  },
  ],
};

export const philosophyQuote =
  "The internet gave everyone a stage. What got lost was the room — the small, private, unrepeatable space where two people actually touch each other.";

export const philosophyParagraphs = [
  "Most social platforms reward performance — the best photo, the wittiest caption, the most polished version of yourself. Connection becomes a side effect of attention.",
  "ThoughtSpace is built for the opposite. A public feed of thoughts. Private responses that become real conversations. No stage. Just two people meeting through what they actually think and feel.",
  "We believe the most meaningful connections still happen in rooms, not on stages. This is our attempt to build one.",
] as const;
