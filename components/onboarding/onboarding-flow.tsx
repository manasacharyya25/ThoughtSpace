"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  initialOnboardingProfile,
  ONBOARDING_THEMES,
} from "@/data/onboarding-themes";
import {
  prepareProfileForSave,
  validateThemeStep,
} from "@/lib/onboarding-validation";
import { createClient } from "@/lib/supabase/client";
import {
  createProfileFromOnboarding,
  isUsernameTaken,
  isUsernameTakenError,
} from "@/lib/supabase/profiles";
import { FadeIn } from "@/components/ui/fade-in";
import { OnboardingContextPanel } from "./onboarding-context-panel";
import { OnboardingPageShell } from "./onboarding-page-shell";
import { OnboardingProgressBar } from "./onboarding-progress-bar";
import { OnboardingQuestionnaire } from "./onboarding-questionnaire";

const primaryButtonClassName =
  "colourful-landing-btn-primary h-auto flex-1 rounded-2xl border-none bg-[#1C1D1E] px-6 py-3 text-xs font-bold text-white hover:bg-[#2F9CFA]";

const secondaryButtonClassName =
  "h-auto flex-1 rounded-2xl border-2 border-[#1C1D1E]/10 bg-white px-6 py-3 text-xs font-bold text-[#1C1D1E] hover:border-[#2F9CFA]/30 hover:bg-[#FAF8F5]";

export function OnboardingFlow() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [profile, setProfile] = useState(initialOnboardingProfile);
  const [error, setError] = useState<string>();
  const [isComplete, setIsComplete] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isContinuing, setIsContinuing] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    const checkSession = async () => {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (cancelled) return;

      if (!user) {
        router.replace("/login");
        return;
      }

      setSessionReady(true);
    };

    void checkSession();

    return () => {
      cancelled = true;
    };
  }, [router]);

  const currentTheme = ONBOARDING_THEMES[stepIndex];
  const isLastStep = stepIndex === ONBOARDING_THEMES.length - 1;

  const updateProfile = (updates: Partial<typeof profile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    if (error) setError(undefined);
  };

  const finishOnboarding = async () => {
    setIsSaving(true);
    setError(undefined);

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      setIsSaving(false);
      router.replace("/login");
      return;
    }

    const preparedProfile = prepareProfileForSave(profile);
    const { error: saveError } = await createProfileFromOnboarding(
      supabase,
      user.id,
      preparedProfile,
      { isGuest: user.is_anonymous }
    );

    if (saveError) {
      setIsSaving(false);
      if (isUsernameTakenError(saveError)) {
        setStepIndex(0);
        setError("That username is already taken. Choose another.");
        return;
      }
      setError(saveError.message || "Could not save your profile. Try again.");
      return;
    }

    setIsComplete(true);
    setIsSaving(false);
    setTimeout(() => router.push("/feed"), 2200);
  };

  const goNext = async () => {
    const validationError = validateThemeStep(currentTheme.id, profile);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (stepIndex === 0) {
      setIsContinuing(true);
      setError(undefined);

      try {
        const supabase = createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        const taken = await isUsernameTaken(supabase, profile.username, {
          excludeUserId: user?.id,
        });

        if (taken) {
          setError("That username is already taken. Choose another.");
          return;
        }
      } finally {
        setIsContinuing(false);
      }
    }

    if (!isLastStep) {
      setStepIndex((index) => index + 1);
      setError(undefined);
      return;
    }

    await finishOnboarding();
  };

  const goBack = () => {
    if (stepIndex > 0) {
      setStepIndex((index) => index - 1);
      setError(undefined);
    }
  };

  const skipStep = () => {
    if (!currentTheme.skippable || isLastStep) return;
    setStepIndex((index) => index + 1);
    setError(undefined);
  };

  if (isComplete) {
    return (
      <OnboardingPageShell
        progress={
          <OnboardingProgressBar
            currentStep={ONBOARDING_THEMES.length - 1}
            totalSteps={ONBOARDING_THEMES.length}
          />
        }
      >
        <div className="mx-auto flex min-h-[50vh] w-full max-w-md flex-col items-center justify-center px-4 py-12 text-center lg:col-span-3">
          <div className="response-check-animate flex h-16 w-16 items-center justify-center rounded-full border border-[#2F9CFA]/30 bg-[#2F9CFA]/10">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="h-8 w-8 text-[#2F9CFA]"
              aria-hidden="true"
            >
              <path d="M5 13l4 4L19 7" className="response-check-path" />
            </svg>
          </div>
          <h2 className="mt-6 text-[clamp(1.15rem,2.2vw,1.5rem)] font-extrabold tracking-[-1px] text-[#1C1D1E]">
            You&apos;re all set, {profile.username}
          </h2>
          <p className="mt-2 text-[clamp(0.7rem,1.35vw,0.79rem)] font-medium text-[#1C1D1E]/65">
            Taking you to your feed…
          </p>
        </div>
      </OnboardingPageShell>
    );
  }

  return (
    <OnboardingPageShell
      progress={
        <OnboardingProgressBar
          currentStep={stepIndex}
          totalSteps={ONBOARDING_THEMES.length}
        />
      }
    >
      <FadeIn
        index={0}
        className="w-full lg:col-start-1 lg:flex lg:items-center lg:justify-end lg:pr-6 xl:pr-10"
      >
        <OnboardingContextPanel theme={currentTheme} />
      </FadeIn>

      <div className="mx-auto mt-6 w-full max-w-lg lg:col-start-2 lg:mt-0">
        <FadeIn index={1}>
          <OnboardingQuestionnaire
            theme={currentTheme}
            profile={profile}
            onChange={updateProfile}
            error={error}
          />

          <div className="relative z-0 mt-4 flex flex-wrap gap-3">
            {stepIndex > 0 ? (
              <Button
                type="button"
                variant="outline"
                className={secondaryButtonClassName}
                onClick={goBack}
                disabled={isSaving || isContinuing}
              >
                Back
              </Button>
            ) : null}

            {currentTheme.skippable && !isLastStep ? (
              <Button
                type="button"
                variant="ghost"
                className="h-auto rounded-2xl px-4 py-3 text-xs font-bold text-[#1C1D1E]/45 hover:bg-[#1C1D1E]/5 hover:text-[#1C1D1E]"
                onClick={skipStep}
                disabled={isSaving || isContinuing}
              >
                Skip
              </Button>
            ) : null}

            <Button
              type="button"
              className={primaryButtonClassName}
              onClick={() => void goNext()}
              disabled={isSaving || isContinuing || !sessionReady}
            >
              {isSaving
                ? "Saving…"
                : isContinuing
                  ? "Checking…"
                  : isLastStep
                    ? "Finish"
                    : "Continue"}
            </Button>
          </div>
        </FadeIn>
      </div>

      <div className="hidden lg:block lg:col-start-3" aria-hidden="true" />
    </OnboardingPageShell>
  );
}
