import Link from "next/link";
import { cn } from "@/lib/utils";
import type { ResolvedSeoLandingPage } from "@/types/seo-landing";
import "./seo-landing.css";

const ACCENT_TONES = [
  {
    stripe: "bg-[#2F9CFA]",
    badge: "bg-[#2F9CFA]/12 text-[#2F9CFA]",
    chip: "border-[#2F9CFA]/20 bg-[#2F9CFA]/[0.08]",
    step: "bg-[#2F9CFA] shadow-[0_8px_24px_-4px_rgba(47,156,250,0.45)]",
  },
  {
    stripe: "bg-[#FFAB91]",
    badge: "bg-[#FFAB91]/20 text-[#E07A5F]",
    chip: "border-[#FFAB91]/30 bg-[#FFAB91]/[0.12]",
    step: "bg-[#FFAB91] shadow-[0_8px_24px_-4px_rgba(255,171,145,0.5)]",
  },
  {
    stripe: "bg-[#B39DDB]",
    badge: "bg-[#B39DDB]/20 text-[#8E7CC3]",
    chip: "border-[#B39DDB]/25 bg-[#B39DDB]/[0.1]",
    step: "bg-[#B39DDB] shadow-[0_8px_24px_-4px_rgba(179,157,219,0.45)]",
  },
  {
    stripe: "bg-[#81C784]",
    badge: "bg-[#C5EAD0] text-[#1E6B37]",
    chip: "border-[#C5EAD0] bg-[#EBF7EE]",
    step: "bg-[#81C784] shadow-[0_8px_24px_-4px_rgba(129,199,132,0.45)]",
  },
  {
    stripe: "bg-[#1C1D1E]",
    badge: "bg-[#1C1D1E]/[0.06] text-[#1C1D1E]/70",
    chip: "border-[#1C1D1E]/10 bg-[#1C1D1E]/[0.04]",
    step: "bg-[#1C1D1E] shadow-[0_8px_24px_-4px_rgba(28,29,30,0.35)]",
  },
] as const;

function highlightThoughtSpace(title: string) {
  if (!title.includes("ThoughtSpace")) {
    const words = title.split(" ");
    if (words.length <= 2) return title;
    const highlight = words.pop()!;
    return (
      <>
        {words.join(" ")}{" "}
        <span className="text-[#2F9CFA]">{highlight}</span>
      </>
    );
  }

  const parts = title.split("ThoughtSpace");
  return (
    <>
      {parts[0]}
      <span className="text-[#2F9CFA]">ThoughtSpace</span>
      {parts[1]}
    </>
  );
}

function SectionEyebrow({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#1C1D1E]/[0.05] bg-white px-4 py-2 text-[0.65rem] font-extrabold uppercase tracking-[1.4px] text-[#1C1D1E]/55 shadow-[0_4px_12px_rgba(0,0,0,0.03)]">
      <span className="text-[#2F9CFA]">✦</span>
      {children}
      <span className="text-[#2F9CFA]">✦</span>
    </div>
  );
}

function SectionShell({
  id,
  eyebrow,
  title,
  children,
  className,
  glow,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
  className?: string;
  glow?: "blue" | "peach" | "lilac";
}) {
  const glowPosition = {
    blue: "-left-[10vw] top-[10%] h-[35vw] w-[35vw]",
    peach: "-right-[8vw] top-[20%] h-[32vw] w-[32vw]",
    lilac: "left-1/2 top-0 h-[30vw] w-[30vw] -translate-x-1/2",
  }[glow ?? "blue"];

  return (
    <section
      aria-labelledby={id}
      className={cn("relative px-5 py-16 sm:px-8 sm:py-24", className)}
    >
      {glow && (
        <div
          className={cn(
            "seo-section-glow",
            `seo-section-glow--${glow}`,
            glowPosition
          )}
          aria-hidden="true"
        />
      )}
      <div className="relative mx-auto max-w-4xl">
        <SectionEyebrow>{eyebrow}</SectionEyebrow>
        <h2
          id={id}
          className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-extrabold leading-[1.1] tracking-[-1.5px] text-[#1C1D1E]"
        >
          {highlightThoughtSpace(title)}
        </h2>
        <div className="mt-10">{children}</div>
      </div>
    </section>
  );
}

function WhatIsSection({ page }: { page: ResolvedSeoLandingPage }) {
  return (
    <SectionShell
      id="what-is"
      eyebrow="Discover"
      title={page.whatIsTitle}
      glow="blue"
      className="bg-[#FAF8F5]"
    >
      <div className="seo-section-card relative overflow-hidden p-6 sm:p-8">
        <div
          className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-[#2F9CFA] via-[#B39DDB] to-[#FFAB91]"
          aria-hidden="true"
        />
        <div className="space-y-5 text-[15px] font-medium leading-[1.8] text-[#1C1D1E]/72">
          {page.whatIs.paragraphs.map((paragraph) => (
            <p key={paragraph.slice(0, 40)}>{paragraph}</p>
          ))}
        </div>
      </div>
    </SectionShell>
  );
}

function WhyChooseSection({ page }: { page: ResolvedSeoLandingPage }) {
  return (
    <SectionShell
      id="why-choose"
      eyebrow="The Difference"
      title={page.whyChoose.title}
      glow="peach"
      className="bg-gradient-to-b from-white to-[#FAF8F5]"
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {page.whyChoose.items.map((item, index) => {
          const tone = ACCENT_TONES[index % ACCENT_TONES.length];
          return (
            <div
              key={item.title}
              className="seo-section-card colourful-landing-float-card relative overflow-hidden p-5 sm:p-6"
            >
              <div
                className={cn("absolute inset-y-0 left-0 w-1", tone.stripe)}
                aria-hidden="true"
              />
              <span
                className={cn(
                  "inline-flex rounded-full px-2.5 py-1 text-[0.6rem] font-extrabold uppercase tracking-wider",
                  tone.badge
                )}
              >
                0{index + 1}
              </span>
              <h3 className="mt-3 text-base font-extrabold text-[#1C1D1E]">
                {item.title}
              </h3>
              <p className="mt-2 text-sm font-medium leading-relaxed text-[#1C1D1E]/65">
                {item.body}
              </p>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}

function HowItWorksSection({ page }: { page: ResolvedSeoLandingPage }) {
  return (
    <SectionShell
      id="how-it-works"
      eyebrow="Simple Steps"
      title={page.howItWorks.title}
      glow="lilac"
      className="bg-[#FAF8F5]"
    >
      <ol className="space-y-0">
        {page.howItWorks.steps.map((step, index) => {
          const tone = ACCENT_TONES[index % ACCENT_TONES.length];
          const isLast = index === page.howItWorks.steps.length - 1;

          return (
            <li key={step.title} className="relative flex gap-5 pb-8 last:pb-0">
              {!isLast && <span className="seo-step-connector" aria-hidden="true" />}
              <span
                className={cn(
                  "relative z-[1] flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white",
                  tone.step
                )}
              >
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="seo-section-card flex-1 p-5 sm:p-6">
                <h3 className="text-base font-extrabold text-[#1C1D1E]">
                  {step.title}
                </h3>
                <p className="mt-2 text-sm font-medium leading-relaxed text-[#1C1D1E]/65">
                  {step.body}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </SectionShell>
  );
}

function KeyBenefitsSection({ page }: { page: ResolvedSeoLandingPage }) {
  return (
    <SectionShell
      id="key-benefits"
      eyebrow="Built For You"
      title={page.keyBenefits.title}
      glow="blue"
      className="bg-gradient-to-b from-[#FAF8F5] via-[#F3F0FF]/40 to-[#FAF8F5]"
    >
      <ul className="grid gap-3 sm:grid-cols-2">
        {page.keyBenefits.items.map((item, index) => {
          const tone = ACCENT_TONES[index % ACCENT_TONES.length];
          return (
            <li
              key={item}
              className={cn(
                "flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm font-semibold text-[#1C1D1E]/80 transition-transform duration-300 hover:-translate-y-0.5",
                tone.chip
              )}
            >
              <span
                className={cn(
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-extrabold text-white",
                  tone.step
                )}
                aria-hidden="true"
              >
                ✓
              </span>
              {item}
            </li>
          );
        })}
      </ul>
    </SectionShell>
  );
}

function FaqSection({ page }: { page: ResolvedSeoLandingPage }) {
  return (
    <SectionShell
      id="faq"
      eyebrow="Questions"
      title={page.faq.title}
      glow="peach"
      className="bg-[#FAF8F5]"
    >
      <div className="space-y-4">
        {page.faq.items.map((item, index) => {
          const tone = ACCENT_TONES[index % ACCENT_TONES.length];
          return (
            <div
              key={item.question}
              className="seo-section-card colourful-landing-float-card relative overflow-hidden p-5 sm:p-6"
            >
              <div
                className={cn("absolute inset-y-0 left-0 w-1", tone.stripe)}
                aria-hidden="true"
              />
              <h3 className="pl-1 text-base font-extrabold text-[#1C1D1E]">
                {item.question}
              </h3>
              <p className="mt-2 pl-1 text-sm font-medium leading-relaxed text-[#1C1D1E]/65">
                {item.answer}
              </p>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}

function FinalCtaSection({ page }: { page: ResolvedSeoLandingPage }) {
  return (
    <section
      aria-labelledby="final-cta"
      className="relative px-5 py-16 sm:px-8 sm:py-24"
    >
      <div
        className="seo-section-glow seo-section-glow--lilac left-1/2 top-1/2 h-[40vw] w-[40vw] -translate-x-1/2 -translate-y-1/2"
        aria-hidden="true"
      />
      <div className="seo-final-cta-panel relative mx-auto max-w-3xl px-6 py-12 text-center sm:px-10 sm:py-16">
        <div
          className="pointer-events-none absolute -left-8 -top-8 h-32 w-32 rounded-full bg-[#2F9CFA]/20 blur-2xl"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-8 -right-8 h-32 w-32 rounded-full bg-[#FFAB91]/25 blur-2xl"
          aria-hidden="true"
        />
        <SectionEyebrow>Take the first step</SectionEyebrow>
        <h2
          id="final-cta"
          className="text-[clamp(1.5rem,3.5vw,2.25rem)] font-extrabold leading-[1.1] tracking-[-1.5px] text-[#1C1D1E]"
        >
          {highlightThoughtSpace(page.finalCta.title)}
        </h2>
        <div className="mt-5 space-y-3 text-[15px] font-medium leading-relaxed text-[#1C1D1E]/65">
          {page.finalCta.lines.map((line) => (
            <p key={line}>{line}</p>
          ))}
        </div>
        <Link
          href="/login"
          className="colourful-landing-btn-primary relative z-[1] mt-8 inline-flex items-center justify-center gap-3 rounded-[20px] border-none bg-[#1C1D1E] px-[42px] py-5 text-[1.05rem] font-bold text-white no-underline shadow-[0_24px_48px_-12px_rgba(28,29,30,0.08)] hover:bg-[#2F9CFA] hover:shadow-[0_12px_32px_-4px_rgba(47,156,250,0.4)]"
        >
          <span>{page.finalCta.cta}</span>
          <svg
            className="colourful-landing-btn-arrow"
            width={18}
            height={18}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

export function SeoLandingSections({ page }: { page: ResolvedSeoLandingPage }) {
  return (
    <div className="seo-landing-sections relative z-10 bg-[#FAF8F5] font-[family-name:var(--font-colourful-landing)] text-[#1C1D1E]">
      <WhatIsSection page={page} />
      <WhyChooseSection page={page} />
      <HowItWorksSection page={page} />
      <KeyBenefitsSection page={page} />
      <FaqSection page={page} />
      <FinalCtaSection page={page} />
    </div>
  );
}
