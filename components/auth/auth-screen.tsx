"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { FadeIn } from "@/components/ui/fade-in";
import { Input } from "@/components/ui/input";
import { AuthModeToggle, type AuthMode } from "./auth-mode-toggle";
import { GoogleIcon } from "./google-icon";
import "@/components/landing/colourful-landing.css";

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

const MIN_PASSWORD_LENGTH = 8;

const inputClassName =
  "h-10 rounded-[14px] border-2 border-transparent bg-[#EDF0F1] px-4 text-[clamp(0.7rem,1.35vw,0.79rem)] font-medium text-[#1C1D1E] placeholder:text-[#1C1D1E]/35 focus-visible:border-[#2F9CFA] focus-visible:bg-white focus-visible:ring-[4px] focus-visible:ring-[#2F9CFA]/10";

const labelClassName =
  "text-[0.65rem] font-extrabold uppercase tracking-[1.2px] text-[#1C1D1E]/50";

const authPrimaryButtonClassName =
  "colourful-landing-btn-primary h-auto w-full gap-2 rounded-2xl border-none bg-[#1C1D1E] px-6 py-3 text-xs font-bold text-white hover:bg-[#2F9CFA]";

type FieldErrors = {
  email?: string;
  password?: string;
  confirmPassword?: string;
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function AuthScreen() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<AuthMode>("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [authError, setAuthError] = useState<string>();
  const [registerSuccess, setRegisterSuccess] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const copy = authCopy[mode];

  useEffect(() => {
    if (searchParams.get("error") === "auth") {
      setAuthError("Sign in failed. Please try again.");
    }
  }, [searchParams]);

  const clearErrors = () => {
    setFieldErrors({});
    setAuthError(undefined);
    setRegisterSuccess(undefined);
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    clearErrors();
  };

  const handleModeChange = (nextMode: AuthMode) => {
    setMode(nextMode);
    resetForm();
  };

  const validateForm = (): boolean => {
    const errors: FieldErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      errors.email = "Enter your email address.";
    } else if (!isValidEmail(trimmedEmail)) {
      errors.email = "Enter a valid email address.";
    }

    if (!password) {
      errors.password = "Enter your password.";
    } else if (password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`;
    }

    if (mode === "register") {
      if (!confirmPassword) {
        errors.confirmPassword = "Confirm your password.";
      } else if (password !== confirmPassword) {
        errors.confirmPassword = "Passwords do not match.";
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleGoogle = async () => {
    setIsLoading(true);
    clearErrors();

    const supabase = createClient();
    const next = mode === "register" ? "/onboarding" : "/feed";
    const redirectTo = `${window.location.origin}/auth/callback?next=${next}`;

    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo },
    });

    if (oauthError) {
      setAuthError(oauthError.message);
      setIsLoading(false);
    }
  };

  const handleEmailAuth = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearErrors();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      const supabase = createClient();
      const trimmedEmail = email.trim();

      if (mode === "login") {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });

        if (signInError) {
          setAuthError(signInError.message);
          return;
        }

        const next = searchParams.get("next") ?? "/feed";
        router.refresh();
        router.push(next);
        return;
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
        },
      });

      if (signUpError) {
        setAuthError(signUpError.message);
        return;
      }

      if (data.session) {
        router.refresh();
        router.push("/onboarding");
        return;
      }

      setRegisterSuccess(
        "Check your email to confirm your account, then log in."
      );
      setPassword("");
      setConfirmPassword("");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative mx-auto w-full">
      <FadeIn index={0}>
        <div className="relative rounded-[28px] border border-[#1C1D1E]/[0.03] bg-white p-5 shadow-[0_24px_48px_-12px_rgba(28,29,30,0.08)]">
          <AuthModeToggle mode={mode} onChange={handleModeChange} variant="light" />

          <div key={mode} className="fade-in-up mt-4 space-y-0.5">
            <h2 className="text-[clamp(1.15rem,2.2vw,1.5rem)] font-extrabold leading-[1.08] tracking-[-1px] text-[#1C1D1E]">
              {copy.title}
            </h2>
            <p className="text-[clamp(0.7rem,1.35vw,0.79rem)] font-medium leading-snug text-[#1C1D1E]/65">
              {copy.description}
            </p>
          </div>

          <div className="mt-4 space-y-3">
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="h-auto w-full gap-3 rounded-lg border border-[#747775] bg-white px-6 py-3 text-sm font-medium text-[#1F1F1F] shadow-none hover:border-[#747775] hover:bg-[#F8F9FA] hover:text-[#1F1F1F]"
                onClick={handleGoogle}
                disabled={isLoading}
              >
                <GoogleIcon className="h-[18px] w-[18px] shrink-0" />
                {isLoading ? "Redirecting…" : "Continue with Google"}
              </Button>
            </div>

            <div className="flex items-center gap-3 text-[11px] font-medium text-[#1C1D1E]/40">
              <div className="h-px flex-1 bg-[#1C1D1E]/10" />
              or
              <div className="h-px flex-1 bg-[#1C1D1E]/10" />
            </div>

            {registerSuccess ? (
              <div className="space-y-4 rounded-[14px] border border-[#1C1D1E]/10 bg-[#EDF0F1] px-4 py-5 text-center">
                <p className="text-[clamp(0.7rem,1.35vw,0.79rem)] font-medium text-[#1C1D1E]">
                  {registerSuccess}
                </p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="rounded-2xl border-[#1C1D1E]/10 text-xs font-bold"
                  onClick={() => {
                    setRegisterSuccess(undefined);
                    setMode("login");
                    clearErrors();
                  }}
                >
                  Back to log in
                </Button>
              </div>
            ) : (
              <form className="space-y-4" onSubmit={handleEmailAuth}>
                <Input
                  label="Email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) {
                      setFieldErrors((prev) => ({ ...prev, email: undefined }));
                    }
                    if (authError) setAuthError(undefined);
                  }}
                  error={fieldErrors.email}
                  autoComplete="email"
                  disabled={isLoading}
                  labelClassName={labelClassName}
                  className={inputClassName}
                />

                <Input
                  label="Password"
                  type="password"
                  placeholder={
                    mode === "register" ? "At least 8 characters" : "Your password"
                  }
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (fieldErrors.password) {
                      setFieldErrors((prev) => ({
                        ...prev,
                        password: undefined,
                      }));
                    }
                    if (authError) setAuthError(undefined);
                  }}
                  error={fieldErrors.password}
                  autoComplete={
                    mode === "register" ? "new-password" : "current-password"
                  }
                  disabled={isLoading}
                  labelClassName={labelClassName}
                  className={inputClassName}
                />

                {mode === "register" && (
                  <Input
                    label="Confirm password"
                    type="password"
                    placeholder="Repeat your password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (fieldErrors.confirmPassword) {
                        setFieldErrors((prev) => ({
                          ...prev,
                          confirmPassword: undefined,
                        }));
                      }
                      if (authError) setAuthError(undefined);
                    }}
                    error={fieldErrors.confirmPassword}
                    autoComplete="new-password"
                    disabled={isLoading}
                    labelClassName={labelClassName}
                    className={inputClassName}
                  />
                )}

                {authError && (
                  <p className="text-center text-xs font-medium text-red-500">
                    {authError}
                  </p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className={authPrimaryButtonClassName}
                  disabled={isLoading}
                >
                  {isLoading
                    ? mode === "register"
                      ? "Creating account…"
                      : "Logging in…"
                    : mode === "register"
                      ? "Create account"
                      : "Log in"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
