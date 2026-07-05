"use client";

import { env } from "@/lib/env";
import Link from "next/link";

export function AboutUsHero() {
  return (
    <header
      id="top"
      className="relative overflow-hidden border-b border-landing-border px-6 pb-24 pt-16 md:pb-36 md:pt-28"
    >
      <div
        className="about-us-ambient-glow pointer-events-none absolute left-1/4 top-0 h-96 w-96 -translate-x-1/2"
        aria-hidden="true"
      />

      <div className="relative z-10 mx-auto max-w-4xl text-center">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#1C1D1E]/[0.04] bg-white px-5 py-2.5 text-[0.7rem] font-extrabold uppercase tracking-[1.5px] text-[#1C1D1E] shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
        <span className="text-[#2F9CFA]">✦</span>
        A New Way to Connect
        <span className="text-[#2F9CFA]">✦</span>
      </div>

        <h1 className="font-landing-serif mb-8 text-4xl leading-none tracking-tight text-gray-100 sm:text-6xl md:text-7xl">
          A thousand stories.{" "}
          <br className="hidden sm:inline" />
          One <span className="italic text-landing-gold">human experience.</span>
        </h1>

        <p className="mx-auto mb-12 max-w-2xl text-base font-light leading-relaxed text-landing-muted sm:text-lg md:text-xl">
        {env.NEXT_PUBLIC_APP_NAME}   is a community for curious minds exploring the thoughts, 
        emotions and questions that often go unspoken. Connect through 
        anonymous one-to-one conversations—free from profiles, followers 
        and the pressure to perform.
        </p>

        <div className="flex justify-center">
        <Link
          href="/login"
          className="colourful-landing-btn-primary inline-flex items-center justify-center gap-3 rounded-[20px] border-none bg-[#1C1D1E] px-[42px] py-5 text-[1.05rem] font-bold text-white no-underline shadow-[0_24px_48px_-12px_rgba(28,29,30,0.08)] hover:bg-[#2F9CFA] hover:shadow-[0_12px_32px_-4px_rgba(47,156,250,0.4)]"
        >
          <span>Join the Community</span>
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

{/*
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
        */}
      </div>
    </header>
  );
}
