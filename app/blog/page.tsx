import { Plus_Jakarta_Sans } from "next/font/google";
import { BlogPageContent, BlogShell } from "@/components/blog";
import { getBlogPosts } from "@/lib/blog";
import { socialMetadata } from "@/lib/seo/social-metadata";
import "@/components/landing/colourful-landing.css";

const blogSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-colourful-landing",
});

export const metadata = socialMetadata({
  title: "Blog",
  description:
    "ThoughtSpace insights on anonymous conversation, privacy, and building deeper human connection.",
  path: "/blog",
});

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
