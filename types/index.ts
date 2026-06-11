export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatarUrl?: string;
  bio?: string;
  createdAt: string;
}

export interface FeedPost {
  id: string;
  author: Pick<User, "id" | "name" | "username" | "avatarUrl">;
  content: string;
  createdAt: string;
  likes: number;
  comments: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  content: string;
  createdAt: string;
}

export interface ChatThread {
  id: string;
  participant: Pick<User, "id" | "name" | "username" | "avatarUrl">;
  messages: ChatMessage[];
  lastMessageAt: string;
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
}

export interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

export interface ApiResponse<T> {
  data: T;
  error?: string;
}

export type { Post, PostCategory, PostRow } from "./post";
export type { PrivateResponse } from "./response";
export type {
  ActiveConversation,
  InboxMessage,
  PendingResponse,
} from "./inbox";
export type { OnboardingProfile, OnboardingStepId } from "./onboarding-profile";
export type { Profile, ProfileRow } from "./profile";
