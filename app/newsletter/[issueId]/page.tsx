import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { generateEmailHTML } from "@/lib/newsletter/generate-email-html";
import { env } from "@/lib/env";
import { createPublicClient } from "@/lib/supabase/public";
import { getPublishedNewsletter } from "@/lib/supabase/newsletters";

type PageProps = {
  params: Promise<{ issueId: string }>;
};

export const revalidate = 60;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { issueId } = await params;
  const supabase = createPublicClient();
  const { data } = await getPublishedNewsletter(supabase, issueId);

  if (!data) return {};

  const { state } = data;
  const title = `${state.heroHeadlineBlack} ${state.heroHeadlineBlue}`.trim();
  const description = state.introText.slice(0, 160);
  const url = `${env.NEXT_PUBLIC_APP_URL}/newsletter/${issueId}`;

  return {
    title: `Issue #${state.issueNum} · ${state.issueDate}`,
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
  const { issueId } = await params;
  const supabase = createPublicClient();
  const { data, error } = await getPublishedNewsletter(supabase, issueId);

  if (error || !data) {
    notFound();
  }

  const html = generateEmailHTML(data.state);

  return (
    <main className="min-h-dvh bg-[#FAF8F5]">
      <iframe
        title={`ThoughtSpace Newsletter Issue #${data.state.issueNum}`}
        srcDoc={html}
        className="block h-dvh w-full border-0"
        sandbox="allow-popups allow-popups-to-escape-sandbox"
      />
    </main>
  );
}
