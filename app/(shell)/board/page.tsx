import type { Metadata } from "next";
import { BoardChat } from "@/components/board";

export const metadata: Metadata = {
  title: "Live",
  description: "Join the open live chat room and talk with other anonymous minds.",
};

export default function BoardPage() {
  return <BoardChat />;
}
