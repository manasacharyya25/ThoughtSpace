"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { FadeIn } from "@/components/ui/fade-in";
import { Input } from "@/components/ui/input";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";
import { AuthModeToggle, type AuthMode } from "./auth-mode-toggle";
import { GoogleIcon } from "./google-icon";

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
            <div className="space-y-2">
              <Button
                type="button"
                variant="outline"
                size="lg"
                className="w-full"
                onClick={handleGoogle}
                disabled={isLoading}
              >
                <GoogleIcon className="h-4 w-4" />
                {isLoading ? "Redirecting…" : "Continue with Google"}
              </Button>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
              <div className="h-px flex-1 bg-border" />
              or
              <div className="h-px flex-1 bg-border" />
            </div>

            {registerSuccess ? (
              <div className="space-y-4 rounded-lg border border-border/40 bg-muted/20 px-4 py-5 text-center">
                <p className="text-sm text-foreground">{registerSuccess}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
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
                  />
                )}

                {authError && (
                  <p className="text-center text-xs text-red-400">{authError}</p>
                )}

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
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

      <FadeIn index={1}>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing, you agree to our{" "}
          <Link
            href="/terms-of-service"
            className="text-foreground underline-offset-2 hover:underline"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy-policy"
            className="text-foreground underline-offset-2 hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
        <Link
          href="/"
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
