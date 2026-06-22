"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { GoogleIcon } from "@/components/auth/google-icon";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import type { SignupModalVariant } from "@/context/trial-context";
import { cn } from "@/lib/utils";
import "@/components/landing/colourful-landing.css";

interface SignupRetentionModalProps {
  open: boolean;
  variant: SignupModalVariant;
  message: string;
  onClose: () => void;
  onSignedUp: () => void;
}

export function SignupRetentionModal({
  open,
  variant,
  message,
  onClose,
  onSignedUp,
}: SignupRetentionModalProps) {
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>();
  const nextPath = pathname || "/feed";

  if (!open) return null;

  const handleGoogle = async () => {
    setIsLoading(true);
    setError(undefined);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const redirectTo = `${window.location.origin}/auth/callback?next=${encodeURIComponent(nextPath)}`;

    if (user?.is_anonymous) {
      const { error: linkError } = await supabase.auth.linkIdentity({
        provider: "google",
        options: { redirectTo },
      });
      if (linkError) {
        setError(linkError.message);
        setIsLoading(false);
      }
      return;
    }

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (oauthError) {
      setError(oauthError.message);
      setIsLoading(false);
      return;
    }

    onSignedUp();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#1C1D1E]/45 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="signup-retention-title"
    >
      <div className="w-full max-w-md rounded-[28px] border border-[#1C1D1E]/[0.06] bg-white p-6 shadow-[0_24px_48px_-12px_rgba(28,29,30,0.2)]">
        <p className="text-[0.65rem] font-extrabold uppercase tracking-[1.2px] text-[#2F9CFA]">
          {variant === "limit" ? "Guest limit reached" : "Save your progress"}
        </p>
        <h2
          id="signup-retention-title"
          className="mt-3 text-[clamp(1.15rem,2.2vw,1.35rem)] font-extrabold leading-snug tracking-[-1px] text-[#1C1D1E]"
        >
          {message}
        </h2>

        <div className="mt-5 space-y-3">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-auto w-full gap-3 rounded-lg border border-[#747775] bg-white px-6 py-3 text-sm font-medium text-[#1F1F1F] shadow-none hover:border-[#747775] hover:bg-[#F8F9FA]"
            onClick={handleGoogle}
            disabled={isLoading}
          >
            <GoogleIcon className="h-[18px] w-[18px] shrink-0" />
            {isLoading ? "Redirecting…" : "Continue with Google"}
          </Button>

          <Link
            href={`/login?next=${encodeURIComponent(nextPath)}`}
            className={cn(
              "colourful-landing-btn-primary flex h-auto w-full items-center justify-center rounded-2xl border-none bg-[#1C1D1E] px-6 py-3 text-xs font-bold text-white no-underline hover:bg-[#2F9CFA]"
            )}
            onClick={onClose}
          >
            Sign up with email
          </Link>

          {error ? (
            <p className="text-center text-xs font-medium text-red-500">{error}</p>
          ) : null}

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2 text-center text-xs font-semibold text-[#1C1D1E]/45 transition-colors hover:text-[#1C1D1E]"
          >
            Continue without signing up
          </button>
        </div>
      </div>
    </div>
  );
}
