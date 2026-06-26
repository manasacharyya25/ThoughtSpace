import Link from "next/link";
import type { ReactNode } from "react";
import { env } from "@/lib/env";
import "@/components/landing/colourful-landing.css";

interface OnboardingPageShellProps {
  children: ReactNode;
  progress: ReactNode;
  backLink?: {
    href: string;
    label: string;
  };
  pageTitle?: string;
}

export function OnboardingPageShell({
  children,
  progress,
  backLink,
  pageTitle,
}: OnboardingPageShellProps) {
  const brandLabel = env.NEXT_PUBLIC_APP_NAME.toLowerCase();

  return (
    <div className="relative min-h-dvh bg-[#FAF8F5] font-[family-name:var(--font-colourful-landing)] text-[#1C1D1E] antialiased">
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-[20vw] -top-[20vw] h-[50vw] w-[50vw] rounded-full bg-[#2F9CFA] opacity-65 blur-[100px]" />
        <div className="absolute -bottom-[15vw] -right-[15vw] h-[45vw] w-[45vw] rounded-full bg-[#FFAB91] opacity-65 blur-[100px]" />
        <div className="absolute left-1/2 top-1/4 z-[1] h-[35vw] w-[35vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B39DDB] opacity-30 blur-[100px]" />
      </div>

      <div className="relative z-10 flex min-h-dvh flex-col">
        <header className="mx-auto flex w-full max-w-[1200px] shrink-0 items-center justify-between px-5 py-3 sm:px-8">
          <Link
            href="/"
            className="colourful-landing-brand flex items-center gap-3 no-underline"
          >
            <div className="colourful-landing-brand-logo flex h-[38px] w-[38px] items-center justify-center rounded-xl bg-[#1C1D1E] text-white">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <div className="text-xl font-extrabold tracking-[-0.5px] text-[#1C1D1E]">
              {brandLabel}.
            </div>
          </Link>
        </header>

        <div className="mx-auto w-full max-w-[1200px] shrink-0 px-5 sm:px-8">
          {backLink || pageTitle ? (
            <div className="mb-4 space-y-2">
              {backLink ? (
                <Link
                  href={backLink.href}
                  className="text-[10px] font-bold uppercase tracking-widest text-[#1C1D1E]/45 transition-colors hover:text-[#2F9CFA]"
                >
                  ← {backLink.label}
                </Link>
              ) : null}
              {pageTitle ? (
                <h1 className="text-[clamp(1.35rem,3vw,2rem)] font-extrabold leading-[1.08] tracking-[-1px] text-[#1C1D1E]">
                  {pageTitle}
                </h1>
              ) : null}
            </div>
          ) : null}
          {progress}
        </div>

        <main className="mx-auto flex w-full max-w-[1200px] flex-1 flex-col px-5 py-4 sm:px-8 lg:grid lg:grid-cols-[minmax(0,1fr)_min(100%,32rem)_minmax(0,1fr)] lg:items-center lg:gap-x-8 lg:py-6">
          {children}
        </main>

        <footer className="mx-auto w-full max-w-[1200px] shrink-0 border-t border-[#1C1D1E]/[0.04] px-5 py-3 text-center sm:px-8">
          <p className="text-[0.58rem] font-medium leading-relaxed text-[#1C1D1E]/45">
            You can always update your answers later. We use them to improve
            matches, not to sell data.
          </p>
        </footer>
      </div>
    </div>
  );
}
