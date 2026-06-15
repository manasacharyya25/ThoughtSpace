import type { Metadata } from "next";
import { FeedContent } from "./feed-content";

export const metadata: Metadata = {
  title: "Whisper Feed",
  description: "Read shared whispers and cast your own into the stream.",
};

export default function FeedPage() {
  return <FeedContent />;
}
