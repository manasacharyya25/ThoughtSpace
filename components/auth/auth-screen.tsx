"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { Input } from "@/components/ui/input";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";
import { AuthModeToggle, type AuthMode } from "./auth-mode-toggle";
import { GoogleIcon } from "./google-icon";

type PhoneStep = "number" | "otp";

const authCopy = {
  login: {
    title: "Welcome back",
    description: "Sign in to continue your conversations.",
  },
  register: {
    title: "Create your account",
    description: "Thoughts first. No photos required.",
  },
} as const;

function isValidPhone(value: string): boolean {
  return /^\+[1-9]\d{7,14}$/.test(value.replace(/\s/g, ""));
}

export function AuthScreen() {
  const [mode, setMode] = useState<AuthMode>("login");
  const [phoneStep, setPhoneStep] = useState<PhoneStep>("number");
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const copy = authCopy[mode];

  const resetPhoneFlow = () => {
    setPhoneStep("number");
    setOtp("");
    setError(undefined);
  };

  const handleModeChange = (nextMode: AuthMode) => {
    setMode(nextMode);
    resetPhoneFlow();
    setError(undefined);
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    setError(undefined);
    // TODO: supabase.auth.signInWithOAuth({ provider: "google", ... })
    setIsLoading(false);
  };

  const handleSendCode = () => {
    const normalized = phone.replace(/\s/g, "");
    if (!isValidPhone(normalized)) {
      setError("Enter a valid phone number with country code (e.g. +14155552671).");
      return;
    }
    setPhone(normalized);
    setError(undefined);
    setPhoneStep("otp");
    // TODO: supabase.auth.signInWithOtp({ phone: normalized })
  };

  const handleVerifyOtp = () => {
    if (otp.trim().length < 6) {
      setError("Enter the 6-digit code we sent you.");
      return;
    }
    setError(undefined);
    // TODO: supabase.auth.verifyOtp({ phone, token: otp, type: "sms" })
    // register → /onboarding, login → /feed
  };

  return (
    <div className="relative mx-auto w-full max-w-md">
      <div className="landing-glow landing-glow-center" aria-hidden="true" />

      <FadeIn index={0}>
        <div className="relative feed-card p-6 sm:p-8">
          <AuthModeToggle mode={mode} onChange={handleModeChange} />

          <div key={mode} className="fade-in-up mt-6 space-y-1">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {copy.title}
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              {copy.description}
            </p>
          </div>

          <div className="mt-8 space-y-4">
            <Button
              type="button"
              variant="outline"
              size="lg"
              className="w-full"
              onClick={handleGoogle}
              disabled={isLoading}
            >
              <GoogleIcon className="h-4 w-4" />
              Continue with Google
            </Button>

            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              or
              <div className="h-px flex-1 bg-border" />
            </div>

            {phoneStep === "number" ? (
              <div className="space-y-4">
                <Input
                  label="Phone number"
                  type="tel"
                  placeholder="+1 555 000 0000"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (error) setError(undefined);
                  }}
                  error={error}
                  autoComplete="tel"
                />
                <p className="text-[11px] text-muted-foreground">
                  We&apos;ll send a one-time code. Include your country code.
                </p>
                <Button
                  type="button"
                  size="lg"
                  className="w-full"
                  onClick={handleSendCode}
                  disabled={isLoading || !phone.trim()}
                >
                  {mode === "register" ? "Sign up with phone" : "Continue with phone"}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Code sent to{" "}
                  <span className="text-foreground">{phone}</span>
                </p>
                <Input
                  label="Verification code"
                  type="text"
                  inputMode="numeric"
                  placeholder="000000"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => {
                    setOtp(e.target.value.replace(/\D/g, ""));
                    if (error) setError(undefined);
                  }}
                  error={error}
                  autoFocus
                  autoComplete="one-time-code"
                />
                <Button
                  type="button"
                  size="lg"
                  className="w-full"
                  onClick={handleVerifyOtp}
                  disabled={isLoading || otp.length < 6}
                >
                  {mode === "register" ? "Create account" : "Log in"}
                </Button>
                <div className="flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={resetPhoneFlow}
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Change number
                  </button>
                  <button
                    type="button"
                    onClick={handleSendCode}
                    className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                  >
                    Resend code
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </FadeIn>

      <FadeIn index={1}>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing, you agree to our terms and privacy policy.
        </p>
        <Link
          href="/landing"
          className={cn(
            "mt-4 block text-center text-sm text-muted-foreground",
            "transition-colors hover:text-foreground"
          )}
        >
          ← Back to {env.NEXT_PUBLIC_APP_NAME}
        </Link>
      </FadeIn>
    </div>
  );
}
