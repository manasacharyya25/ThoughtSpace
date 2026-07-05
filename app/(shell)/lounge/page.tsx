import type { Metadata } from "next";
import { BoardChat } from "@/components/board";

export const metadata: Metadata = {
  title: "Lounge",
  description: "Gather, listen, and share in the ThoughtSpace Lounge.",
};

export default function LoungePage() {
  return <BoardChat />;
}
