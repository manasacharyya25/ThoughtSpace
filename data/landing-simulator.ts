export type ConversationTurn = {
  strangerReply: string;
  guideline: string;
};

export const sampleThoughts = [
  "I feel more lonely in a crowded room than when I'm completely alone.",
  "Is anyone actually sure of what they are doing, or is adulthood a massive performance?",
] as const;

export const conversationArcs: Record<"lonely" | "default", ConversationTurn[]> = {
  lonely: [
    {
      strangerReply:
        "Hello... your thought struck a deep chord with me. I was just thinking about that same exact disconnect today.",
      guideline:
        "Ask them why they think we hide ourselves, or how they cope with it.",
    },
    {
      strangerReply:
        "I think we spend so much energy projecting a safe, successful version of ourselves that we end up hiding who we really are. It makes interactions feel hollow. Even when people speak to us, they aren't speaking to the real us on the inside. It's exhausting, isn't it?",
      guideline:
        "Tell me, do you have even one person in your life you don't have to perform for?",
    },
    {
      strangerReply:
        "Vulnerability is terrifying because if someone rejects the real you, it hurts permanently. If they reject the facade, it's easy to dismiss. So we construct these walls. By the way, I should introduce my surroundings—I am sitting near a kitchen window in Montreal, listening to distant sirens and the hum of the fridge. Where on this earth are you typing from?",
      guideline:
        "Share your general location or the environment surrounding you right now.",
    },
    {
      strangerReply:
        "That visual is so beautiful to think about. We are thousands of miles apart, completely anonymous, yet having a more authentic exchange than I've had with my coworkers in three months. That's the tragic beauty of this, I guess. Do you find comfort in this fleeting moment, or does the ephemerality of it make you a bit sad?",
      guideline:
        "Be honest about whether anonymous chats make you feel comforted or nostalgic.",
    },
    {
      strangerReply:
        "I think it is beautiful because it has no gravity. No expectations of a follow-up, no profiles to compare. Just two minds colliding in the dark. It has been an absolute privilege listening to you. I feel lighter. Shall we save this connection, or let our words melt into the ether?",
      guideline: "Wrap up the chat or decide to save the connection.",
    },
  ],
  default: [
    {
      strangerReply:
        "That is incredibly profound. I have sat with a very similar feeling for months, but never knew how to format it into words. It feels reassuring to read it written down by a complete stranger.",
      guideline:
        "Tell me what parts of adulthood or uncertainty feel like a performance to you.",
    },
    {
      strangerReply:
        "Exactly. It feels like we are all background actors in each other's movies, completely absorbed in our own complicated scripts, yet pretending we have everything perfectly calculated. No one wants to admit they are just guessing as they go.",
      guideline: "Share an insecurity or something you're currently trying to figure out.",
    },
    {
      strangerReply:
        "I relate to that more than you know. Sometimes I look around at people who seem to have it all together, and I wonder if they're just better at memorizing their lines. I am sitting in a quiet apartment in Kyoto right now. It's raining outside, and the streets are perfectly dark. What does the world look like from your window right now?",
      guideline: "Describe your current physical setting or what you see outside.",
    },
    {
      strangerReply:
        "I can practically feel that atmosphere through your words. It's funny how a few sentences of text can convey more presence than curated photo feeds. We are too complex for profiles. If we met in real life, we'd probably just walk right past each other. Does that thought feel tragic or liberating to you?",
      guideline:
        "Share whether you find the vastness of the world comforting or lonely.",
    },
    {
      strangerReply:
        "I lean towards liberating. It means we don't have to carry the weight of the entire world—just our own small corner. Thank you for this beautiful, unscripted moment. It's rare to find someone who thinks this deeply. Let's close this chat in peace, or save it if you'd like to talk again.",
      guideline: "Choose how you'd like to conclude this ephemeral exchange.",
    },
  ],
};

export const matchingSubtitles = [
  "Scanning semantic vectors...",
  "Discovering another mind with matching frequency...",
  "Connecting secure private terminal...",
  "Connection established safely.",
] as const;

export const heroPrinciples = [
  { label: "01. INTIMACY", value: "Strictly 1-to-1 Chats" },
  { label: "02. EQUALITY", value: "Zero Popularity Metrics" },
  { label: "03. PRESENCE", value: "Ephemeral Text Only" },
  { label: "04. FREEDOM", value: "No Profile Pressure" },
] as const;

export const whisperStreamCards = [
  {
    id: "friendships",
    tag: "#friendships",
    time: "Matched 2m ago",
    prompt:
      "I wonder if any of my childhood friends still listen to the same music we used to obsess over, or if I'm the only one clinging to those years.",
    topic: "friendships & music",
  },
  {
    id: "melancholy",
    tag: "#melancholy",
    time: "Matched 12m ago",
    prompt:
      "I am surrounded by people at work and home, yet I feel incredibly lonely. It's like I am speaking a language that no one around me understands.",
    topic: "unspoken isolation",
  },
  {
    id: "hope",
    tag: "#hope",
    time: "Matched 42m ago",
    prompt:
      "I saw an elderly couple holding hands on the subway today. It made me realize that despite how fast the world changes, simple devotion is still possible.",
    topic: "simple devotion",
  },
] as const;

export const simulatedCastEchoes = [
  {
    id: "echo-1",
    strangerPseudonym: "LoomingMind",
    text: "Your words reached me in a quiet moment. I understand that feeling deeply. For me, it feels like navigating a landscape where everyone reads a script while I'm desperately trying to speak from my core.",
  },
  {
    id: "echo-2",
    strangerPseudonym: "KyotoRain",
    text: "There is a rare warmth in how simply you put this. It's refreshing to read something unfiltered instead of curated milestones.",
  },
] as const;

export const acceptedChatFollowups = [
  "I really appreciate you accepting my echo connection. This platform feels so different when you're actually writing from the heart.",
  "It is rare to find someone who shares this exact perspective. We are completely anonymous but I feel a strange clarity discussing this with you.",
  "I think the beauty of this space is that we don't have to carry the pressure of permanent profiles. Let's enjoy this ephemeral space while it lasts.",
] as const;

export const faqItems = [
  {
    question: "How exactly do matches happen?",
    answer:
      "Instead of matching by swipe metrics or photos, we pair you based on the thoughts you share. If you are expressing feelings of grief, excitement, or philosophical wonder, the system connects you with someone reflecting on a similar human frequency.",
  },
  {
    question: "Is there really no profile history?",
    answer:
      "Correct. You have zero public pages, zero permanent links, and no profile descriptions. You start every session as a pristine voice. Once your conversation is closed by either party, that ephemeral connection is gone. Beautiful, unrepeatable, and safe.",
  },
] as const;
