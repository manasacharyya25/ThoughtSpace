"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { onboardingStepMeta } from "@/data/onboarding-options";
import { validateOnboardingStep } from "@/lib/onboarding-validation";
import { cn } from "@/lib/utils";
import type {
  OnboardingProfile,
  OnboardingStepId,
} from "@/types/onboarding-profile";
import { OnboardingStepContent } from "./onboarding-steps";
import { ProgressIndicator } from "./progress-indicator";

const STEPS: OnboardingStepId[] = ["username", "age", "country", "bio"];

const initialProfile: OnboardingProfile = {
  username: "",
  ageRange: "",
  country: "",
  bio: "",
};

export function OnboardingFlow() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [profile, setProfile] = useState<OnboardingProfile>(initialProfile);
  const [error, setError] = useState<string>();
  const [isComplete, setIsComplete] = useState(false);

  const currentStep = STEPS[stepIndex];
  const meta = onboardingStepMeta[stepIndex];

  const updateProfile = (updates: Partial<OnboardingProfile>) => {
    setProfile((prev) => ({ ...prev, ...updates }));
    if (error) setError(undefined);
  };

  const goNext = () => {
    const validationError = validateOnboardingStep(currentStep, profile);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (stepIndex < STEPS.length - 1) {
      setDirection("forward");
      setStepIndex((i) => i + 1);
      setError(undefined);
    } else {
      setIsComplete(true);
      setTimeout(() => router.push("/feed"), 2200);
    }
  };

  const goBack = () => {
    if (stepIndex > 0) {
      setDirection("back");
      setStepIndex((i) => i - 1);
      setError(undefined);
    }
  };

  if (isComplete) {
    return (
      <div className="onboarding-complete-animate flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
        <div className="response-check-animate flex h-16 w-16 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-500/10">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="h-8 w-8 text-emerald-400"
            aria-hidden="true"
          >
            <path d="M5 13l4 4L19 7" className="response-check-path" />
          </svg>
        </div>
        <h2 className="mt-6 text-2xl font-semibold tracking-tight">
          You&apos;re all set, {profile.username}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Taking you to your feed…
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 py-8 sm:py-12">
      <ProgressIndicator currentStep={stepIndex} totalSteps={STEPS.length} />

      <div
        key={currentStep}
        className={cn(
          "mt-10",
          direction === "forward"
            ? "onboarding-step-forward"
            : "onboarding-step-back"
        )}
      >
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {meta.title}
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {meta.description}
          </p>
        </div>

        <div className="mt-8">
          <OnboardingStepContent
            step={currentStep}
            profile={profile}
            onChange={updateProfile}
            error={error}
          />
        </div>
      </div>

      <div className="mt-10 flex gap-3">
        {stepIndex > 0 && (
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={goBack}
          >
            Back
          </Button>
        )}
        <Button
          type="button"
          className="flex-1"
          onClick={goNext}
        >
          {stepIndex === STEPS.length - 1 ? "Finish" : "Continue"}
        </Button>
      </div>
    </div>
  );
}
