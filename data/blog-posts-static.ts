import type { BlogPost, BlogPostSource } from "@/types/blog";
import { toBlogPost } from "@/types/blog";
import { BLOG_CLUSTER_POSTS } from "./blog-cluster-posts";

const CORE_BLOG_POSTS: BlogPostSource[] = [
  {
    slug: "why-anonymous-conversation-changes-everything",
    title: "Why Anonymous Conversation Changes Everything",
    excerpt:
      "When your name and photo disappear, something unexpected happens: people start listening. Anonymity isn't about hiding — it's about making room for honesty.",
    category: "Connection",
    categoryId: "connection",
    publishedAt: "2026-03-12",
    readTime: "6 min read",
    featured: true,
    image: {
      src: "/blog/anonymous-conversation.jpg",
      alt: "Two people having a thoughtful conversation",
      accent: "bg-[#2F9CFA]",
      label: "Dialogue",
    },
    content: [
      "Most social platforms ask you to show up fully identified before you've said a single word. Your photo, your bio, your follower count — all visible before anyone knows what you think.",
      "Anonymous conversation flips that order. Ideas come first. Questions come first. The pressure to perform for an audience fades because there is no audience — just one other person willing to listen.",
      "At ThoughtSpace, we've seen how this changes the texture of dialogue. People share uncertainties they would never post publicly. They ask questions they would not ask under their real name. Connection happens through substance, not staging.",
      "Anonymity is not an escape from accountability. It's an invitation to honesty — and honesty is where meaningful relationships begin.",
    ],
  },
  {
    slug: "the-case-against-follower-counts",
    title: "The Case Against Follower Counts",
    excerpt:
      "Follower counts were supposed to measure influence. Instead, they measure performance — and performance is the enemy of real connection.",
    category: "Philosophy",
    categoryId: "philosophy",
    publishedAt: "2026-03-08",
    readTime: "5 min read",
    featured: true,
    image: {
      src: "/blog/follower-counts.jpg",
      alt: "Person using a smartphone with social apps",
      accent: "bg-[#FFAB91]",
      label: "Metrics",
    },
    content: [
      "Every follower count is a small scoreboard. And scoreboards change how people talk. You begin optimizing for applause instead of understanding.",
      "ThoughtSpace was built on a simple belief: the most meaningful connections happen in rooms, not on stages. Rooms don't have follower counts. They have two people paying attention.",
      "When you remove metrics, conversation changes. There's nothing to chase, nothing to compare, nothing to perform for. What remains is curiosity — and curiosity is a far better foundation for friendship than popularity.",
      "We're not anti-social. We're pro-human. And humans connect best when nobody is keeping score.",
    ],
  },
  {
    slug: "one-to-one-beats-the-feed",
    title: "One-to-One Beats the Feed",
    excerpt:
      "Feeds are built for scrolling. Conversations are built for listening. Here's why we chose the format that social media forgot.",
    category: "Product",
    categoryId: "product",
    publishedAt: "2026-03-01",
    readTime: "4 min read",
    featured: true,
    image: {
      src: "/blog/one-to-one.jpg",
      alt: "Friends sharing a focused moment together",
      accent: "bg-[#81C784]",
      label: "Focus",
    },
    content: [
      "The feed is the defining invention of modern social media — and arguably its most damaging one. Infinite scroll trains your attention to skim, judge, and move on.",
      "One-to-one conversation does the opposite. It asks you to stay. To respond. To wonder what the other person meant, felt, or hoped you would understand.",
      "ThoughtSpace is deliberately not a feed. Every match is a single thread between two people. No public comments. No viral moments. No audience watching you perform.",
      "That constraint is the feature. Depth requires focus — and focus requires saying no to the noise.",
    ],
  },
  {
    slug: "privacy-is-not-secrecy",
    title: "Privacy Is Not Secrecy",
    excerpt:
      "Privacy means choosing what to share and when. It's the foundation of trust — not a loophole for bad behavior.",
    category: "Privacy",
    categoryId: "privacy",
    publishedAt: "2026-02-22",
    readTime: "5 min read",
    featured: false,
    image: {
      src: "/blog/privacy.jpg",
      alt: "Laptop on a desk in a quiet private space",
      accent: "bg-[#1C1D1E]",
      label: "Trust",
    },
    content: [
      "Privacy is often confused with secrecy — as if wanting anonymity means having something to hide. That's backwards.",
      "Privacy is the space where honesty becomes possible. It's the difference between performing for a crowd and speaking freely to one person who is actually listening.",
      "ThoughtSpace is privacy-first by design: no public profile, no follower graph, no pressure to reveal more than you're ready to share. Your conversations belong to the conversation — not to a platform optimizing for engagement.",
      "Respectful dialogue and privacy aren't opposites. They're partners.",
    ],
  },
  {
    slug: "small-talk-is-overrated",
    title: "Small Talk Is Overrated",
    excerpt:
      "Not every conversation needs to be deep — but the best ones rarely start with the weather. Here's how to move past pleasantries.",
    category: "Connection",
    categoryId: "connection",
    publishedAt: "2026-02-14",
    readTime: "4 min read",
    featured: false,
    image: {
      src: "/blog/small-talk.jpg",
      alt: "People chatting casually at a table",
      accent: "bg-[#B39DDB]",
      label: "Curiosity",
    },
    content: [
      "Small talk has its place — but too many platforms trap you there forever. Swipe. Hello. Weather. Goodbye. Repeat.",
      "ThoughtSpace nudges conversations toward curiosity instead. Thought prompts, open questions, and space to follow a thread wherever it leads.",
      "You don't need to trauma-dump on a stranger to have a meaningful chat. Sometimes the right question — about a belief, a memory, a wonder — is enough to turn small talk into something you'll remember.",
      "The goal isn't intensity for its own sake. It's authenticity. And authenticity rarely fits in a greeting.",
    ],
  },
  {
    slug: "building-a-sanctuary-not-a-stage",
    title: "Building a Sanctuary, Not a Stage",
    excerpt:
      "ThoughtSpace began with a question: what if social media felt like a quiet room instead of a spotlight?",
    category: "Philosophy",
    categoryId: "philosophy",
    publishedAt: "2026-02-05",
    readTime: "7 min read",
    featured: false,
    image: {
      src: "/blog/sanctuary.jpg",
      alt: "Sunlit living room with a calm, welcoming atmosphere",
      accent: "bg-[#2F9CFA]",
      label: "Sanctuary",
    },
    content: [
      "The internet gave everyone a stage. What got lost was the room — the small, private, unrepeatable space where two people actually meet.",
      "Stages reward the loudest voice. Rooms reward the most attentive listener. ThoughtSpace is our attempt to rebuild the room.",
      "We stripped away photos, follower counts, and public feeds not because they're evil, but because they pull attention away from the only thing that matters: what two people say to each other when nobody else is watching.",
      "A sanctuary isn't boring. It's calm enough for honesty — and honesty is where connection lives.",
    ],
  },
];

export const BLOG_POSTS: BlogPost[] = [...CORE_BLOG_POSTS, ...BLOG_CLUSTER_POSTS].map(
  toBlogPost
);
