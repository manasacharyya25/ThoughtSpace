"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/brand/brand-logo";
import { FadeIn } from "@/components/ui/fade-in";
import { createClient } from "@/lib/supabase/client";
import { getProfileByUserId } from "@/lib/supabase/profiles";
import "@/components/landing/colourful-landing.css";

const STATUS_MESSAGES = [
  "Resuming where you left off…",
  "Checking your session…",
  "Loading your space…",
] as const;

export function StartResumeScreen() {
  const router = useRouter();
  const [progress, setProgress] = useState(8);
  const [statusIndex, setStatusIndex] = useState(0);

  useEffect(() => {
    const progressInterval = window.setInterval(() => {
      setProgress((current) => {
        if (current >= 92) return current;
        return Math.min(92, current + Math.random() * 10 + 4);
      });
    }, 220);

    const statusInterval = window.setInterval(() => {
      setStatusIndex((current) => (current + 1) % STATUS_MESSAGES.length);
    }, 1500);

    return () => {
      window.clearInterval(progressInterval);
      window.clearInterval(statusInterval);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function resume() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) return;

      if (!user) {
        setProgress(100);
        await new Promise((resolve) => window.setTimeout(resolve, 280));
        if (!cancelled) {
          router.replace("/login");
        }
        return;
      }

      const profile = await getProfileByUserId(supabase, user.id);

      if (cancelled) return;

      setProgress(100);
      const destination = profile ? "/feed" : "/onboarding";

      await new Promise((resolve) => window.setTimeout(resolve, 320));
      if (!cancelled) {
        router.replace(destination);
        router.refresh();
      }
    }

    void resume();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const status = STATUS_MESSAGES[statusIndex];
  const displayProgress = Math.round(progress);

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

      <div className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-5 py-8">
        <header className="absolute left-0 right-0 top-0 flex justify-center px-5 py-6">
          <BrandLogo />
        </header>

        <FadeIn className="w-full max-w-sm">
          <div className="rounded-[28px] border border-[#1C1D1E]/[0.03] bg-white p-6 shadow-[0_24px_48px_-12px_rgba(28,29,30,0.08)]">
            <p className="text-[0.65rem] font-extrabold uppercase tracking-[1.2px] text-[#2F9CFA]">
              Welcome back
            </p>
            <h1 className="mt-2 text-[clamp(1.15rem,2.2vw,1.35rem)] font-extrabold leading-snug tracking-[-1px] text-[#1C1D1E]">
              Picking up your thread
            </h1>
            <p
              className="mt-2 min-h-[1.25rem] text-[clamp(0.7rem,1.35vw,0.79rem)] font-medium text-[#1C1D1E]/65 transition-opacity duration-300"
              aria-live="polite"
            >
              {status}
            </p>

            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-[11px] font-medium text-[#1C1D1E]/45">
                <span>Restoring session</span>
                <span>{displayProgress}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-[#EDF0F1]">
                <div
                  className="h-full rounded-full bg-[#2F9CFA] transition-[width] duration-300 ease-out"
                  style={{ width: `${displayProgress}%` }}
                  role="progressbar"
                  aria-valuenow={displayProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label="Resuming your session"
                />
              </div>
            </div>
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
