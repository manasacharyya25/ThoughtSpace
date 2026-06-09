import type { ChatThread } from "@/types";

export const chatThreads: ChatThread[] = [
  {
    id: "thread-1",
    participant: {
      id: "user-2",
      name: "Jordan Lee",
      username: "jordanl",
    },
    lastMessageAt: "2025-06-09T16:20:00Z",
    messages: [
      {
        id: "msg-1",
        senderId: "user-2",
        content: "Hey, did you see the new feed layout?",
        createdAt: "2025-06-09T16:18:00Z",
      },
      {
        id: "msg-2",
        senderId: "user-1",
        content: "Yes — really clean. Love the card spacing.",
        createdAt: "2025-06-09T16:20:00Z",
      },
    ],
  },
  {
    id: "thread-2",
    participant: {
      id: "user-3",
      name: "Sam Rivera",
      username: "samr",
    },
    lastMessageAt: "2025-06-08T11:00:00Z",
    messages: [
      {
        id: "msg-3",
        senderId: "user-3",
        content: "Onboarding step 2 is ready for review.",
        createdAt: "2025-06-08T11:00:00Z",
      },
    ],
  },
];
