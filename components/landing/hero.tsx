"use client";

import { heroPrinciples } from "@/data/landing-simulator";
import { env } from "@/lib/env";
import { scrollToSection } from "@/lib/scroll-to-section";

export function Hero() {
  return (
    <header
      id="top"
      className="relative overflow-hidden border-b border-landing-border px-6 pb-24 pt-16 md:pb-36 md:pt-28"
    >
      <div
        className="landing-ambient-glow pointer-events-none absolute left-1/4 top-0 h-96 w-96 -translate-x-1/2"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        <span className="mb-6 inline-block rounded-full border border-landing-border bg-landing-gold/5 px-3 py-1 font-landing-mono text-xs uppercase tracking-widest text-landing-gold">
          A New Way to Connect
        </span>

        <h1 className="font-landing-serif mb-8 text-4xl leading-none tracking-tight text-gray-100 sm:text-6xl md:text-7xl">
          A thousand stories. {" "}
          <br className="hidden sm:inline" />
          One <span className="italic text-landing-gold">human experience</span>.
        </h1>

        <p className="mx-auto mb-12 max-w-2xl text-base font-light leading-relaxed text-landing-muted sm:text-lg md:text-xl">
          {env.NEXT_PUBLIC_APP_NAME} strips away the performance of modern
          social media. We connect you 1-to-1 with other anonymous minds, based
          entirely on the questions you ask, the feelings you carry, and the
          ways you wonder.
        </p>


        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row sm:space-x-4 sm:space-y-0">
          <button
            type="button"
            onClick={() => scrollToSection("simulator")}
            className="flex w-full items-center justify-center rounded-lg bg-white px-8 py-4 text-center font-medium text-black transition-all duration-300 hover:bg-landing-gold sm:w-auto"
          >
            <span>Try the Match Simulator</span>
            <svg
              className="ml-2 inline-block h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => scrollToSection("playground")}
            className="inline-block w-full rounded-lg border border-landing-border bg-landing-card px-8 py-4 text-center font-medium text-gray-300 transition-all duration-300 hover:bg-white/[0.03] sm:w-auto"
          >
            Explore the Live Stream
          </button>
        </div>

        <div className="mx-auto mt-20 grid max-w-3xl grid-cols-2 gap-4 border-t border-landing-border pt-10 text-left font-landing-mono md:grid-cols-4">
          {heroPrinciples.map((item) => (
            <div
              key={item.label}
              className="rounded-lg border border-landing-border bg-black p-4"
            >
              <div className="mb-1 text-xs text-landing-muted">{item.label}</div>
              <div className="text-sm text-gray-200">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
}
