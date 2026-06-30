import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { BlogPageContent, BlogShell } from "@/components/blog";
import { getBlogPosts } from "@/lib/blog";
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

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className={blogSans.variable}>
      <BlogShell>
        <BlogPageContent initialPosts={posts} />
      </BlogShell>
    </div>
  );
}
