import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";
import { BrandLogo } from "@/components/brand/brand-logo";
import { LandingFooter } from "@/components/landing/landing-footer";
import { env } from "@/lib/env";
import { createPublicClient } from "@/lib/supabase/public";
import { listPublishedNewsletters } from "@/lib/supabase/newsletters";
import { newsletterIssuePath } from "@/lib/newsletter/issue-slug";
import { socialMetadata } from "@/lib/seo/social-metadata";
import "@/components/landing/colourful-landing.css";

const newsletterSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-colourful-landing",
});

export const metadata = socialMetadata({
  title: "Newsletters",
  description: `Browse published ${env.NEXT_PUBLIC_APP_NAME} newsletter issues.`,
  path: "/newsletters",
});

export const revalidate = 60;

export default async function NewslettersPage() {
  const supabase = createPublicClient();
  const { data: newsletters, error } = await listPublishedNewsletters(supabase);

  return (
    <div
      className={`${newsletterSans.variable} relative min-h-dvh overflow-hidden bg-[#FAF8F5] font-[family-name:var(--font-colourful-landing)] text-[#1C1D1E] antialiased`}
    >
      <div
        className="pointer-events-none absolute -left-[20vw] -top-[20vw] z-0 h-[50vw] w-[50vw] rounded-full bg-[#2F9CFA] opacity-50 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-[15vw] -right-[15vw] z-0 h-[45vw] w-[45vw] rounded-full bg-[#FFAB91] opacity-50 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/3 z-0 h-[35vw] w-[35vw] -translate-x-1/2 rounded-full bg-[#B39DDB] opacity-25 blur-[100px]"
        aria-hidden="true"
      />

      <div className="relative z-10">
        <header className="px-4 py-4 sm:px-6">
          <nav
            className="mx-auto flex max-w-3xl items-center justify-between gap-4"
            aria-label="Newsletters navigation"
          >
            <BrandLogo />
            <Link
              href="/login"
              className="colourful-landing-btn-primary shrink-0 rounded-full bg-[#1C1D1E] px-4 py-2 text-[0.65rem] font-bold uppercase tracking-wider text-white no-underline transition-all hover:bg-[#2F9CFA] sm:px-5 sm:text-xs"
            >
              Join us
            </Link>
          </nav>
        </header>

        <main className="mx-auto w-full max-w-3xl px-4 pb-12 pt-6 sm:px-6 sm:pt-10">
          <p className="text-[0.65rem] font-extrabold uppercase tracking-[1.2px] text-[#2F9CFA]">
            Archive
          </p>
          <h1 className="mt-2 text-[clamp(1.75rem,4vw,2.5rem)] font-extrabold leading-[1.08] tracking-[-1.5px] text-[#1C1D1E]">
            Newsletters
          </h1>
          <p className="mt-3 max-w-xl text-[clamp(0.8rem,1.5vw,0.95rem)] font-medium leading-relaxed text-[#1C1D1E]/65">
            Essays, reflections, and quiet prompts from the ThoughtSpace
            community — one issue at a time.
          </p>

          {error ? (
            <div className="mt-10 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-12 text-center text-sm font-medium text-rose-700">
              Could not load newsletters. If this persists, check that public
              read RLS is enabled for published issues.
            </div>
          ) : newsletters.length === 0 ? (
            <div className="mt-10 rounded-2xl border border-[#1C1D1E]/[0.06] bg-white/80 px-5 py-12 text-center text-sm font-medium text-[#1C1D1E]/50">
              No published issues yet. Check back soon.
            </div>
          ) : (
            <ul className="mt-10 space-y-3">
              {newsletters.map((issue) => {
                const { state } = issue;
                const issueNum = issue.issue_num || state.issueNum;
                const headline =
                  `${state.heroHeadlineBlack} ${state.heroHeadlineBlue}`.trim();

                return (
                  <li key={issue.id}>
                    <Link
                      href={newsletterIssuePath(issueNum)}
                      className="block rounded-2xl border border-[#1C1D1E]/[0.06] bg-white/85 px-5 py-5 no-underline shadow-[0_8px_24px_-12px_rgba(28,29,30,0.08)] transition-colors hover:border-[#2F9CFA]/25 hover:bg-white"
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-[#1C1D1E]/[0.06] px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[1.2px] text-[#1C1D1E]/55">
                          Issue #{issueNum}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-[1.2px] text-[#1C1D1E]/40">
                          {state.issueDate}
                        </span>
                      </div>
                      <h2 className="mt-3 text-[clamp(1.05rem,2vw,1.25rem)] font-extrabold leading-snug tracking-[-0.5px] text-[#1C1D1E]">
                        {headline}
                      </h2>
                      <p className="mt-2 line-clamp-2 text-sm font-medium leading-relaxed text-[#1C1D1E]/55">
                        {state.introText}
                      </p>
                      <span className="mt-3 inline-block text-xs font-bold text-[#2F9CFA]">
                        Read issue →
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </main>

        <div className="mx-auto max-w-3xl px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-6">
          <LandingFooter />
        </div>
      </div>
    </div>
  );
}
