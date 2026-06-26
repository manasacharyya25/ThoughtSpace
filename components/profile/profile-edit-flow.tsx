"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { OnboardingContextPanel } from "@/components/onboarding/onboarding-context-panel";
import { OnboardingProgressBar } from "@/components/onboarding/onboarding-progress-bar";
import { OnboardingQuestionnaire } from "@/components/onboarding/onboarding-questionnaire";
import { OnboardingPageShell } from "@/components/onboarding/onboarding-page-shell";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { useProfile } from "@/hooks/use-profile";
import { useUser } from "@/hooks/use-user";
import {
  getPendingCompleteProfileQuestionIds,
  getPendingCompleteProfileQuestions,
  getProfileEditStepForThemeId,
  getProfileEditThemes,
  isCompleteProfileTheme,
  profileToOnboardingProfile,
} from "@/lib/profile-edit";
import {
  prepareProfileForSave,
  validateProfileEditTheme,
} from "@/lib/onboarding-validation";
import { createClient } from "@/lib/supabase/client";
import { updateProfileFromOnboarding } from "@/lib/supabase/profiles";

const PROFILE_EDIT_THEMES = getProfileEditThemes();

const primaryButtonClassName =
  "colourful-landing-btn-primary h-auto flex-1 rounded-2xl border-none bg-[#1C1D1E] px-6 py-3 text-xs font-bold text-white hover:bg-[#2F9CFA]";

const secondaryButtonClassName =
  "h-auto flex-1 rounded-2xl border-2 border-[#1C1D1E]/10 bg-white px-6 py-3 text-xs font-bold text-[#1C1D1E] hover:border-[#2F9CFA]/30 hover:bg-[#FAF8F5]";

function LockedAccountFields({
  username,
  email,
}: {
  username: string;
  email?: string | null;
}) {
  return (
    <div className="mb-4 space-y-3 rounded-[14px] border border-[#1C1D1E]/[0.06] bg-[#FAF8F5] p-4">
      <p className="text-[0.65rem] font-extrabold uppercase tracking-[1.2px] text-[#1C1D1E]/50">
        Cannot be changed
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wide text-[#1C1D1E]/40">
            Username
          </span>
          <p className="text-sm font-extrabold text-[#1C1D1E]">@{username}</p>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wide text-[#1C1D1E]/40">
            Email
          </span>
          <p className="truncate text-sm font-medium text-[#2F9CFA]">
            {email ?? "—"}
          </p>
        </div>
      </div>
    </div>
  );
}

function PendingProfileBanner({
  pendingCount,
  onJumpToComplete,
}: {
  pendingCount: number;
  onJumpToComplete: () => void;
}) {
  if (pendingCount === 0) return null;

  return (
    <div className="flex flex-col gap-3 rounded-[20px] border border-[#2F9CFA]/20 bg-[#EBF5FF] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-semibold text-[#1C1D1E]">
        {pendingCount} complete-profile{" "}
        {pendingCount === 1 ? "question" : "questions"} still unanswered
      </p>
      <button
        type="button"
        onClick={onJumpToComplete}
        className="shrink-0 rounded-2xl bg-[#1C1D1E] px-4 py-2 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#2F9CFA]"
      >
        Answer now
      </button>
    </div>
  );
}

export function ProfileEditFlow() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: userLoading } = useUser();
  const { profile, loading: profileLoading, refreshProfile } = useProfile();

  const [stepIndex, setStepIndex] = useState(0);
  const [draft, setDraft] = useState(() =>
    profile ? profileToOnboardingProfile(profile) : null
  );
  const [error, setError] = useState<string>();
  const [isSaving, setIsSaving] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (!user && !userLoading) {
      router.replace("/login?next=/profile/edit");
    }
  }, [router, user, userLoading]);

  useEffect(() => {
    if (!profile || initialized) return;

    setDraft(profileToOnboardingProfile(profile));
    setInitialized(true);

    const themeParam = searchParams.get("theme");
    if (themeParam) {
      const step = getProfileEditStepForThemeId(themeParam);
      if (step >= 0) setStepIndex(step);
    }
  }, [profile, initialized, searchParams]);

  const currentTheme = PROFILE_EDIT_THEMES[stepIndex];
  const isLastStep = stepIndex === PROFILE_EDIT_THEMES.length - 1;
  const isCompleteTheme = isCompleteProfileTheme(currentTheme);

  const pendingQuestionIds = useMemo(
    () => (draft ? getPendingCompleteProfileQuestionIds(draft) : new Set<string>()),
    [draft]
  );

  const pendingCount = useMemo(
    () => (draft ? getPendingCompleteProfileQuestions(draft).length : 0),
    [draft]
  );

  const updateDraft = (updates: Partial<NonNullable<typeof draft>>) => {
    setDraft((prev) => (prev ? { ...prev, ...updates } : prev));
    if (error) setError(undefined);
  };

  const saveProfile = async () => {
    if (!draft || !user) return;

    setIsSaving(true);
    setError(undefined);

    const supabase = createClient();
    const preparedProfile = prepareProfileForSave(draft);
    const { error: saveError } = await updateProfileFromOnboarding(
      supabase,
      user.id,
      preparedProfile
    );

    setIsSaving(false);

    if (saveError) {
      setError(saveError.message || "Could not save your profile. Try again.");
      return;
    }

    await refreshProfile();
    router.push("/profile");
    router.refresh();
  };

  const goNext = async () => {
    if (!draft) return;

    const validationError = validateProfileEditTheme(currentTheme, draft);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (!isLastStep) {
      setStepIndex((index) => index + 1);
      setError(undefined);
      return;
    }

    await saveProfile();
  };

  const goBack = () => {
    if (stepIndex > 0) {
      setStepIndex((index) => index - 1);
      setError(undefined);
    }
  };

  const skipCompleteStep = () => {
    if (!isCompleteTheme || isLastStep) return;
    setStepIndex((index) => index + 1);
    setError(undefined);
  };

  const jumpToCompleteProfile = () => {
    const step = getProfileEditStepForThemeId("connections");
    if (step >= 0) setStepIndex(step);
  };

  if (userLoading || profileLoading || !draft || !profile || !user) {
    return (
      <OnboardingPageShell
        backLink={{ href: "/profile", label: "Back to profile" }}
        pageTitle="Edit profile"
        progress={
          <div className="h-8 animate-pulse rounded-full bg-[#EDF0F1]" />
        }
      >
        <div className="lg:col-span-3">
          <div className="mx-auto h-96 max-w-lg animate-pulse rounded-[28px] bg-[#EDF0F1]" />
        </div>
      </OnboardingPageShell>
    );
  }

  return (
    <OnboardingPageShell
      backLink={{ href: "/profile", label: "Back to profile" }}
      pageTitle="Edit profile"
      progress={
        <div className="space-y-3">
          <PendingProfileBanner
            pendingCount={pendingCount}
            onJumpToComplete={jumpToCompleteProfile}
          />
          <OnboardingProgressBar
            currentStep={stepIndex}
            totalSteps={PROFILE_EDIT_THEMES.length}
          />
        </div>
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
          {stepIndex === 0 ? (
            <LockedAccountFields
              username={profile.username}
              email={user.email}
            />
          ) : null}

          <OnboardingQuestionnaire
            theme={currentTheme}
            profile={draft}
            onChange={updateDraft}
            error={error}
            pendingQuestionIds={
              isCompleteTheme ? pendingQuestionIds : undefined
            }
          />

          <div className="relative z-0 mt-4 flex flex-wrap gap-3">
            {stepIndex > 0 ? (
              <Button
                type="button"
                variant="outline"
                className={secondaryButtonClassName}
                onClick={goBack}
                disabled={isSaving}
              >
                Back
              </Button>
            ) : null}

            {isCompleteTheme && !isLastStep ? (
              <Button
                type="button"
                variant="ghost"
                className="h-auto rounded-2xl px-4 py-3 text-xs font-bold text-[#1C1D1E]/45 hover:bg-[#1C1D1E]/5 hover:text-[#1C1D1E]"
                onClick={skipCompleteStep}
                disabled={isSaving}
              >
                Skip for now
              </Button>
            ) : null}

            <Button
              type="button"
              className={primaryButtonClassName}
              onClick={() => void goNext()}
              disabled={isSaving}
            >
              {isSaving ? "Saving…" : isLastStep ? "Save profile" : "Continue"}
            </Button>
          </div>
        </FadeIn>
      </div>

      <div className="hidden lg:block lg:col-start-3" aria-hidden="true" />
    </OnboardingPageShell>
  );
}
