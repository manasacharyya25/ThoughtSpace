import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { generateEmailHTML } from "@/lib/newsletter/generate-email-html";
import {
  newsletterIssuePath,
  parseNewsletterIssueSlug,
} from "@/lib/newsletter/issue-slug";
import { env } from "@/lib/env";
import { createPublicClient } from "@/lib/supabase/public";
import { getPublishedNewsletterByIssueNum } from "@/lib/supabase/newsletters";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export const revalidate = 60;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const issueNum = parseNewsletterIssueSlug(slug);
  if (!issueNum) return {};

  const supabase = createPublicClient();
  const { data } = await getPublishedNewsletterByIssueNum(supabase, issueNum);

  if (!data) return {};

  const { state } = data;
  const title = `${state.heroHeadlineBlack} ${state.heroHeadlineBlue}`.trim();
  const description = state.introText.slice(0, 160);
  const url = `${env.NEXT_PUBLIC_APP_URL}${newsletterIssuePath(data.issue_num)}`;

  return {
    title: `Issue #${data.issue_num} · ${state.issueDate}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
    },
  };
}

export default async function NewsletterIssuePage({ params }: PageProps) {
  const { slug } = await params;
  const issueNum = parseNewsletterIssueSlug(slug);

  if (!issueNum) {
    notFound();
  }

  const supabase = createPublicClient();
  const { data, error } = await getPublishedNewsletterByIssueNum(
    supabase,
    issueNum
  );

  if (error || !data) {
    notFound();
  }

  const html = generateEmailHTML(data.state);
  const displayNum = data.issue_num || data.state.issueNum;

  return (
    <main className="min-h-dvh bg-[#FAF8F5]">
      <iframe
        title={`ThoughtSpace Newsletter Issue #${displayNum}`}
        srcDoc={html}
        className="block h-dvh w-full border-0"
        sandbox="allow-popups allow-popups-to-escape-sandbox"
      />
    </main>
  );
}
