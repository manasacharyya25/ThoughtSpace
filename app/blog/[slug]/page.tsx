import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Source_Serif_4 } from "next/font/google";
import { notFound } from "next/navigation";
import { BlogPostView, BlogShell } from "@/components/blog";
import { getBlogPost, getBlogSlugs } from "@/lib/blog";
import { env } from "@/lib/env";
import "@/components/landing/colourful-landing.css";

const blogSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-colourful-landing",
});

const blogBodySerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-claude-response",
});

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getBlogSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) return {};

  const url = `${env.NEXT_PUBLIC_APP_URL}/blog/${slug}`;
  const imageUrl = post.image.src.startsWith("http")
    ? post.image.src
    : `${env.NEXT_PUBLIC_APP_URL}${post.image.src}`;

  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.publishedAt,
      images: [{ url: imageUrl, alt: post.image.alt }],
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = await getBlogPost(slug);
  if (!post) notFound();

  return (
    <div className={`${blogSans.variable} ${blogBodySerif.variable}`}>
      <BlogShell>
        <BlogPostView post={post} />
      </BlogShell>
    </div>
  );
}
