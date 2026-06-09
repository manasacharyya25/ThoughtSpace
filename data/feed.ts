import type { FeedPost } from "@/types";

export const feedPosts: FeedPost[] = [
  {
    id: "post-1",
    author: {
      id: "user-2",
      name: "Jordan Lee",
      username: "jordanl",
    },
    content:
      "Just shipped a new dark-mode design system. Subtle borders and muted tones make all the difference.",
    createdAt: "2025-06-08T18:00:00Z",
    likes: 24,
    comments: 5,
  },
  {
    id: "post-2",
    author: {
      id: "user-3",
      name: "Sam Rivera",
      username: "samr",
    },
    content:
      "Scalable folder structure is underrated. Clear separation between data, types, and UI pays off fast.",
    createdAt: "2025-06-07T12:30:00Z",
    likes: 18,
    comments: 3,
  },
  {
    id: "post-3",
    author: {
      id: "user-1",
      name: "Alex Morgan",
      username: "alexm",
    },
    content:
      "Working on onboarding flows that feel minimal but guide users without friction.",
    createdAt: "2025-06-06T09:45:00Z",
    likes: 31,
    comments: 8,
  },
];
