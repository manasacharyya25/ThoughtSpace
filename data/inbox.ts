import type { ActiveConversation, PendingResponse } from "@/types/inbox";

export const pendingResponses: PendingResponse[] = [
  {
    id: "pending-1",
    fromInitial: "M",
    thoughtExcerpt:
      "I've started measuring my days by the conversations that made me pause…",
    responsePreview:
      "This stopped me mid-scroll. I do the same thing — count the pauses, not the hours…",
    fullResponse:
      "This stopped me mid-scroll. I do the same thing — count the pauses, not the hours. Last week someone asked me what I was afraid of losing and I couldn't answer. I think that's when I knew I needed spaces like this — where a question can sit unanswered without feeling like failure.",
    category: "reflection",
    receivedAt: "2025-06-09T10:14:00Z",
  },
  {
    id: "pending-2",
    fromInitial: "K",
    thoughtExcerpt:
      "What if loneliness isn't the absence of people, but the absence of being truly known?",
    responsePreview:
      "I felt this in a room full of friends last month. Everyone talking, nobody listening…",
    fullResponse:
      "I felt this in a room full of friends last month. Everyone talking, nobody listening. Then one person remembered I'd mentioned a book three weeks earlier and asked how it ended. That tiny moment of being held in someone's memory undid an entire evening of feeling invisible.",
    category: "philosophy",
    receivedAt: "2025-06-08T19:42:00Z",
  },
  {
    id: "pending-3",
    fromInitial: "R",
    thoughtExcerpt:
      "Sometimes I lie awake wondering if other people also rehearse conversations they'll never have…",
    responsePreview:
      "Every night. I have entire dialogues prepared for people I'll probably never see again…",
    fullResponse:
      "Every night. I have entire dialogues prepared for people I'll probably never see again. The courage it takes to send one real sentence instead of rehearsing a hundred — that's what your thought made me think about. So here I am, sending one.",
    category: "vulnerability",
    receivedAt: "2025-06-07T08:30:00Z",
  },
];

export const activeConversations: ActiveConversation[] = [
  {
    id: "conv-1",
    partnerInitial: "A",
    startedFrom:
      "There's a particular loneliness that comes from being surrounded by people who only know your highlights.",
    lastMessageAt: "2025-06-09T15:48:00Z",
    messages: [
      {
        id: "c1-m1",
        content:
          "Your thought about highlights-only loneliness — I've been carrying a version of that for years. Nobody in my life knows I still write letters I never send.",
        isFromMe: false,
        createdAt: "2025-06-08T14:10:00Z",
      },
      {
        id: "c1-m2",
        content:
          "The unsent letters part hit me. I think we all have a drawer like that — real words we almost shared. What would you put in one, if you knew it would be read with care?",
        isFromMe: true,
        createdAt: "2025-06-08T16:22:00Z",
      },
      {
        id: "c1-m3",
        content:
          "Probably an apology to my younger self for all the times I performed confidence when I was just scared. Thank you for making space for that answer.",
        isFromMe: false,
        createdAt: "2025-06-09T15:48:00Z",
      },
    ],
  },
  {
    id: "conv-2",
    partnerInitial: "S",
    startedFrom:
      "What question would you ask a version of yourself from ten years ago?",
    lastMessageAt: "2025-06-08T21:05:00Z",
    messages: [
      {
        id: "c2-m1",
        content:
          "I'd ask: what did you know then that you've since forgotten? I suspect past-me had answers I've been too busy to remember.",
        isFromMe: true,
        createdAt: "2025-06-07T11:00:00Z",
      },
      {
        id: "c2-m2",
        content:
          "Mine would be: 'Are you still curious?' I think ten-years-ago me would say yes, and present-me would have to admit I've traded curiosity for certainty more than I'd like.",
        isFromMe: false,
        createdAt: "2025-06-08T09:30:00Z",
      },
      {
        id: "c2-m3",
        content:
          "Trading curiosity for certainty — that's beautifully put. Maybe the work is just noticing when we're doing it.",
        isFromMe: true,
        createdAt: "2025-06-08T21:05:00Z",
      },
    ],
  },
  {
    id: "conv-3",
    partnerInitial: "J",
    startedFrom:
      "Grief update: it's quieter now, but not smaller.",
    lastMessageAt: "2025-06-06T17:20:00Z",
    messages: [
      {
        id: "c3-m1",
        content:
          "I lost someone two years ago and your line about joy not being betrayal — I cried reading it. Nobody had said that to me before.",
        isFromMe: false,
        createdAt: "2025-06-05T20:15:00Z",
      },
      {
        id: "c3-m2",
        content:
          "I'm glad it found you when you needed it. Grief doesn't follow rules, and neither does healing. You don't owe anyone a consistent emotional posture.",
        isFromMe: true,
        createdAt: "2025-06-06T17:20:00Z",
      },
    ],
  },
];
