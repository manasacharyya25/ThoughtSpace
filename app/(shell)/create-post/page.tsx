import type { Metadata } from "next";
import { CreatePostScreen } from "@/components/create-post";

export const metadata: Metadata = {
  title: "Post",
};

export default function CreatePostPage() {
  return <CreatePostScreen />;
}
