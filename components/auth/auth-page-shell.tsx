import Link from "next/link";
import type { ReactNode } from "react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { LandingFooter } from "@/components/landing/landing-footer";
import { env } from "@/lib/env";
import "@/components/landing/colourful-landing.css";

const contextParagraphs = [
  "Signing in helps us maintain a high-quality space for genuine conversations while keeping your identity separate from your thoughts.",
  "We only store what's needed to run the service. Your private conversations remain private.",
] as const;

interface AuthPageShellProps {
  children: ReactNode;
}

export function AuthPageShell({ children }: AuthPageShellProps) {
  return (
    <div className="relative min-h-dvh bg-[#FAF8F5] font-[family-name:var(--font-colourful-landing)] text-[#1C1D1E] antialiased">
      <div
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-[20vw] -top-[20vw] h-[50vw] w-[50vw] rounded-full bg-[#2F9CFA] opacity-65 blur-[100px]" />
        <div className="absolute -bottom-[15vw] -right-[15vw] h-[45vw] w-[45vw] rounded-full bg-[#FFAB91] opacity-65 blur-[100px]" />
        <div className="absolute left-1/2 top-1/4 h-[35vw] w-[35vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B39DDB] opacity-30 blur-[100px]" />
      </div>

      <div className="relative z-10 flex min-h-dvh flex-col">
      <header className="relative z-10 mx-auto flex w-full max-w-[1200px] shrink-0 items-center justify-between px-5 py-3 sm:px-8">
        <BrandLogo />
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-[1100px] flex-1 flex-col items-center justify-center gap-[clamp(0.75rem,2.5dvh,1.5rem)] px-5 py-4 sm:px-8 lg:flex-row lg:justify-between lg:gap-[clamp(1rem,3dvh,2rem)]">
        <section className="max-w-md shrink text-center lg:max-w-lg lg:text-left">
          <p className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#1C1D1E]/[0.04] bg-white px-4 py-1.5 text-[0.65rem] font-extrabold uppercase tracking-[1.5px] text-[#1C1D1E] shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
            <span className="text-[#2F9CFA]">✦</span>
            A thoughtful community
            <span className="text-[#2F9CFA]">✦</span>
          </p>

          <h1 className="max-w-[540px] text-[clamp(1.5rem,3vw,2.44rem)] font-extrabold leading-[1.08] tracking-[-2px] text-[#1C1D1E]">
            A thoughtful community starts with{" "}
            <span className="text-[#2F9CFA]">real people.</span>
          </h1>

          <div className="mt-[0.5em] max-w-[405px] space-y-[0.45em] text-[clamp(0.7rem,1.35vw,0.79rem)] font-medium leading-snug text-[#1C1D1E]/65">
            <p>{contextParagraphs[0]}</p>
            <p className="hidden md:block">{contextParagraphs[1]}</p>
          </div>
        </section>

        <div className="w-full max-w-md shrink-0">
          {children}
          <p className="mt-4 text-center text-[0.58rem] font-medium leading-relaxed text-[#1C1D1E]/45">
            By continuing, you agree to our terms and privacy policy.{" "}
            <Link
              href="/"
              className="text-[#1C1D1E]/55 transition-colors hover:text-[#2F9CFA]"
            >
              ← Back to {env.NEXT_PUBLIC_APP_NAME}
            </Link>
          </p>
        </div>
      </main>

      <div className="relative z-10 mx-auto w-full max-w-[1200px] shrink-0 px-5 pb-4 sm:px-8">
        <LandingFooter />
      </div>
      </div>
    </div>
  );
}
