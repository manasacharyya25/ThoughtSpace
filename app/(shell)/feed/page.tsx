import type { Metadata } from "next";
import { FeedContent } from "./feed-content";

export const metadata: Metadata = {
  title: "Feed",
  description: "Thoughts from minds worth knowing.",
};

export default function FeedPage() {
  return <FeedContent />;
}
