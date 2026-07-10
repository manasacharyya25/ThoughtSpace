"use client";

import { useState, type FormEvent } from "react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { LandingClouds } from "@/components/landing/landing-clouds";
import { LandingFooter } from "@/components/landing/landing-footer";
import "@/components/landing/colourful-landing.css";

const BADGE = "A New Way to Connect";
const HEADLINE_BLACK = "Explore the Quiet Complexities";
const HEADLINE_BLUE = "of Being Human.";
const SUBHEADING =
  "Every week, we unpack the thoughts, emotions and questions that often go unspoken—through essays, reflections and meaningful conversations. Our hope is simple: to create a safe space where we can connect through our shared human experience.";

export function SubscribePage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const response = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const payload = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok) {
        setError(payload.error ?? "Could not subscribe. Try again.");
        return;
      }

      setSuccess(true);
      setEmail("");
    } catch {
      setError("Could not subscribe. Try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-[#FAF8F5] font-[family-name:var(--font-colourful-landing)] text-[#1C1D1E] antialiased">
      <div
        className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
        aria-hidden="true"
      >
        <div className="absolute -left-[20vw] -top-[20vw] h-[50vw] w-[50vw] rounded-full bg-[#2F9CFA] opacity-65 blur-[100px]" />
        <div className="absolute -bottom-[15vw] -right-[15vw] h-[45vw] w-[45vw] rounded-full bg-[#FFAB91] opacity-65 blur-[100px]" />
        <div className="absolute left-1/2 top-1/4 h-[35vw] w-[35vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B39DDB] opacity-30 blur-[100px]" />
      </div>

      <LandingClouds />

      <div className="relative z-10 flex min-h-dvh flex-col">
        <header className="flex shrink-0 justify-start px-5 py-4 sm:px-8 sm:py-5">
          <BrandLogo />
        </header>

        <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-5 pb-8 text-center sm:px-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-[#1C1D1E]/[0.04] bg-white px-5 py-2.5 text-[0.7rem] font-extrabold uppercase tracking-[1.5px] text-[#1C1D1E] shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
            <span className="text-[#2F9CFA]">✦</span>
            {BADGE}
            <span className="text-[#2F9CFA]">✦</span>
          </div>

          <h1 className="mt-5 text-[clamp(1.45rem,3.5vw,2.25rem)] font-extrabold leading-[1.12] tracking-[-1.2px] text-[#1C1D1E] sm:mt-6">
            {HEADLINE_BLACK}
            <br />
            <span className="text-[#2F9CFA]">{HEADLINE_BLUE}</span>
          </h1>

          <p className="mx-auto mt-4 max-w-[480px] text-[clamp(0.72rem,1.4vw,0.85rem)] font-medium leading-relaxed text-[#1C1D1E]/65 sm:mt-5">
            {SUBHEADING}
          </p>

          {success ? (
            <div className="mt-8 w-full max-w-md rounded-2xl border border-[#C5EAD0] bg-[#EBF7EE] px-5 py-5 text-sm font-semibold text-[#1E6B37] sm:mt-10">
              You&apos;re on the list. We&apos;ll be in touch soon.
            </div>
          ) : (
            <form
              onSubmit={(event) => void handleSubmit(event)}
              className="mt-8 w-full max-w-md sm:mt-10"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:gap-2">
                <label className="sr-only" htmlFor="subscribe-email">
                  Email address
                </label>
                <input
                  id="subscribe-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(event) => {
                    setEmail(event.target.value);
                    if (error) setError(null);
                  }}
                  disabled={submitting}
                  placeholder="Enter your email"
                  className="h-12 min-w-0 flex-1 rounded-2xl border-2 border-transparent bg-white px-4 text-sm font-medium text-[#1C1D1E] shadow-[0_8px_24px_-12px_rgba(28,29,30,0.12)] placeholder:text-[#1C1D1E]/35 focus:border-[#2F9CFA] focus:outline-none focus:ring-[4px] focus:ring-[#2F9CFA]/10 disabled:opacity-60"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="colourful-landing-btn-primary inline-flex h-12 shrink-0 items-center justify-center rounded-2xl border-none bg-[#1C1D1E] px-6 text-xs font-bold text-white shadow-[0_24px_48px_-12px_rgba(28,29,30,0.08)] transition-colors hover:bg-[#2F9CFA] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Subscribing…" : "Subscribe"}
                </button>
              </div>

              {error ? (
                <p className="mt-3 text-sm font-medium text-rose-600" role="alert">
                  {error}
                </p>
              ) : null}
            </form>
          )}
        </main>

        <div className="mx-auto w-full max-w-3xl shrink-0 px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] sm:px-8">
          <LandingFooter />
        </div>
      </div>
    </div>
  );
}
