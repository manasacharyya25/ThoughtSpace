import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { BlogPageContent, BlogShell } from "@/components/blog";
import "@/components/landing/colourful-landing.css";

const blogSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-colourful-landing",
});

export const metadata: Metadata = {
  title: "Blog",
  description:
    "ThoughtSpace insights on anonymous conversation, privacy, and building deeper human connection.",
};

export default function BlogPage() {
  return (
    <div className={blogSans.variable}>
      <BlogShell>
        <BlogPageContent />
      </BlogShell>
    </div>
  );
}
