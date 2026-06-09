import type { User } from "@/types";

export const currentUser: User = {
  id: "user-1",
  name: "Alex Morgan",
  username: "alexm",
  email: "alex@example.com",
  avatarUrl: undefined,
  bio: "Building thoughtful digital experiences.",
  createdAt: "2025-01-15T10:00:00Z",
};

export const users: User[] = [
  currentUser,
  {
    id: "user-2",
    name: "Jordan Lee",
    username: "jordanl",
    email: "jordan@example.com",
    bio: "Designer & developer",
    createdAt: "2025-02-01T14:30:00Z",
  },
  {
    id: "user-3",
    name: "Sam Rivera",
    username: "samr",
    email: "sam@example.com",
    bio: "Product thinker",
    createdAt: "2025-02-10T09:15:00Z",
  },
];
