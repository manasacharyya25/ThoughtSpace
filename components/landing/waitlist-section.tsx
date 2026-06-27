"use client";

import { useState } from "react";

export function WaitlistSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <section id="waitlist" className="relative overflow-hidden px-6 py-24">
      <div className="relative z-10 mx-auto max-w-xl space-y-8 text-center">
        <span className="font-landing-mono text-xs uppercase tracking-widest text-landing-gold">
          Secure Your Space
        </span>
        <h2 className="font-landing-serif text-3xl text-gray-100 sm:text-5xl">
          Step away from the metrics.
        </h2>
        <p className="text-sm font-light leading-relaxed text-landing-muted sm:text-base">
          Join our selective cohort of readers, dreamers, philosophers, and
          humans. We are currently rolling out access keys to maintain the
          balance of the sanctuary.
        </p>

        {!submitted ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="landing-input flex-1 rounded-lg px-4 py-3 text-sm"
                placeholder="Your email address"
              />
              <button
                type="submit"
                className="rounded-lg bg-white px-6 py-3 font-landing-mono text-xs font-bold uppercase tracking-wider text-black transition-all duration-300 hover:bg-landing-gold"
              >
                Request Key
              </button>
            </div>
            <div className="flex items-center justify-center space-x-2 font-landing-mono text-xs text-landing-muted">
              <svg
                className="mr-1 inline-block h-4 w-4 text-landing-gold"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
              <span>We never sell data. Privacy is built into our software stack.</span>
            </div>
          </form>
        ) : (
          <div className="space-y-3 rounded-lg border border-landing-gold/30 bg-landing-card p-6 text-left">
            <h4 className="font-landing-mono text-xs font-bold uppercase tracking-wider text-landing-gold">
              ✓ Welcome to the Quiet Network
            </h4>
            <p className="text-xs font-light leading-relaxed text-gray-300">
              We have secured your place on the waitlist. A personalized invite
              key will be delivered to{" "}
              <span className="font-semibold text-gray-100">{email}</span> once
              our server doors open for your region.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
