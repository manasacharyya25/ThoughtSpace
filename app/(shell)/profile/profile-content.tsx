"use client";

import Link from "next/link";
import { COMPLETE_PROFILE_FIELD_IDS } from "@/data/onboarding-themes";
import { useLogout } from "@/hooks/use-logout";
import { useProfile } from "@/hooks/use-profile";
import { useUser } from "@/hooks/use-user";
import { env } from "@/lib/env";
import {
  getProfileGenderLabel,
  hasCompleteProfileAnswers,
} from "@/lib/profile-mapper";
import {
  getPendingCompleteProfileQuestions,
  profileToOnboardingProfile,
} from "@/lib/profile-edit";
import { cn } from "@/lib/utils";
import type { OnboardingAnswers } from "@/types/profile";
import "@/components/landing/colourful-landing.css";

function formatMemberSince(date: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
  }).format(new Date(date));
}

function ProfileField({
  label,
  value,
  className,
  valueClassName,
}: {
  label: string;
  value: string;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <label className="block text-[0.65rem] font-extrabold uppercase tracking-[1.2px] text-[#1C1D1E]/50">
        {label}
      </label>
      <span
        className={cn(
          "text-sm font-medium text-[#1C1D1E]/80",
          valueClassName
        )}
      >
        {value}
      </span>
    </div>
  );
}

function ProfileTagList({
  label,
  tags,
}: {
  label: string;
  tags: string[];
}) {
  if (tags.length === 0) return null;

  return (
    <div className="space-y-2">
      <label className="block text-[0.65rem] font-extrabold uppercase tracking-[1.2px] text-[#1C1D1E]/50">
        {label}
      </label>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-[#2F9CFA]/20 bg-[#2F9CFA]/[0.08] px-3 py-1 text-[11px] font-semibold text-[#1C1D1E]/80"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}

function ProfileCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "whisper-card rounded-[20px] border border-[#1C1D1E]/[0.03] bg-white shadow-[0_24px_48px_-12px_rgba(28,29,30,0.08)]",
        className
      )}
    >
      {children}
    </section>
  );
}

function ProfileLoadingSkeleton() {
  return (
    <div className="whisper-feed mx-auto max-w-2xl animate-pulse space-y-6 py-2 sm:py-4">
      <div className="flex items-end justify-between">
        <div className="h-8 w-28 rounded-lg bg-[#EDF0F1]" />
        <div className="h-3 w-20 rounded bg-[#EDF0F1]" />
      </div>
      <div className="h-36 rounded-[20px] bg-[#EDF0F1]" />
      <div className="h-32 rounded-[20px] bg-[#EDF0F1]" />
      <div className="h-40 rounded-[20px] bg-[#EDF0F1]" />
      <div className="h-48 rounded-[20px] bg-[#EDF0F1]" />
    </div>
  );
}

function ProfileEmptyState({
  description,
  actionLabel,
  actionHref,
}: {
  description: string;
  actionLabel: string;
  actionHref: string;
}) {
  return (
    <ProfileCard className="p-8 text-center">
      <p className="text-sm font-medium text-[#1C1D1E]/55">{description}</p>
      <Link
        href={actionHref}
        className="colourful-landing-btn-primary mt-5 inline-block rounded-2xl border-none bg-[#1C1D1E] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#2F9CFA]"
      >
        {actionLabel}
      </Link>
    </ProfileCard>
  );
}

function ProfileHeader({ showEdit = false }: { showEdit?: boolean }) {
  return (
    <header className="flex items-end justify-between pb-2">
      <h1 className="text-[clamp(1.35rem,3vw,2rem)] font-extrabold leading-[1.08] tracking-[-1px] text-[#1C1D1E]">
        Profile
      </h1>
      {showEdit && (
        <Link
          href="/profile/edit"
          className="pb-1 text-[10px] font-bold uppercase tracking-widest text-[#1C1D1E]/45 transition-colors hover:text-[#2F9CFA]"
        >
          Edit profile
        </Link>
      )}
    </header>
  );
}

const completeProfileFieldLabels: Partial<
  Record<(typeof COMPLETE_PROFILE_FIELD_IDS)[number], string>
> = {
  impact: "Impact you want to make",
  hobbies: "Hobbies & activities",
  conversationMeaning: "Meaningful conversations",
  conversationDepth: "Conversation depth",
  connectionGoals: "Connection goals",
  greatConnection: "Ideal connection",
  comfortableSharing: "Comfortable sharing",
  displayPreference: "Display preference",
  contentVisibility: "Content visibility",
  surpriseFact: "Surprise fact",
  quote: "Quote or idea",
  superpower: "Superpower",
};

function CompleteProfileSection({ answers }: { answers: OnboardingAnswers }) {
  const textFields = [
    { label: completeProfileFieldLabels.impact, value: answers.impact },
    {
      label: completeProfileFieldLabels.hobbies,
      value: answers.hobbies,
    },
    {
      label: completeProfileFieldLabels.conversationMeaning,
      value: answers.conversationMeaning,
    },
    {
      label: completeProfileFieldLabels.conversationDepth,
      value: answers.conversationDepth,
    },
    {
      label: completeProfileFieldLabels.greatConnection,
      value: answers.greatConnection,
    },
    {
      label: completeProfileFieldLabels.displayPreference,
      value: answers.displayPreference,
    },
    {
      label: completeProfileFieldLabels.contentVisibility,
      value: answers.contentVisibility,
    },
    {
      label: completeProfileFieldLabels.surpriseFact,
      value: answers.surpriseFact,
    },
    { label: completeProfileFieldLabels.quote, value: answers.quote },
    {
      label: completeProfileFieldLabels.superpower,
      value: answers.superpower,
    },
  ].filter((field) => field.value && field.label);

  const tagFields = [
    {
      label: completeProfileFieldLabels.connectionGoals ?? "Connection goals",
      tags: answers.connectionGoals ?? [],
    },
    {
      label:
        completeProfileFieldLabels.comfortableSharing ?? "Comfortable sharing",
      tags: answers.comfortableSharing ?? [],
    },
  ].filter((field) => field.tags.length > 0);

  if (textFields.length === 0 && tagFields.length === 0) return null;

  return (
    <ProfileCard className="space-y-6 p-6 sm:p-8">
      <div>
        <h3 className="text-base font-extrabold tracking-tight text-[#1C1D1E]">
          More about you
        </h3>
        <p className="mt-1 text-xs font-medium text-[#1C1D1E]/45">
          Additional details from your profile.
        </p>
      </div>

      {tagFields.map((field) => (
        <ProfileTagList key={field.label} label={field.label} tags={field.tags} />
      ))}

      {textFields.map((field) => (
        <ProfileField
          key={field.label}
          label={field.label!}
          value={field.value!}
        />
      ))}
    </ProfileCard>
  );
}

function CompleteProfilePrompt({ pendingCount }: { pendingCount: number }) {
  return (
    <ProfileCard className="border-dashed border-[#2F9CFA]/25 bg-[#EBF5FF]/30 p-6 sm:p-8">
      <h3 className="text-base font-extrabold tracking-tight text-[#1C1D1E]">
        Complete your profile
      </h3>
      <p className="mt-2 text-xs font-medium leading-relaxed text-[#1C1D1E]/55">
        {pendingCount > 0
          ? `${pendingCount} optional ${pendingCount === 1 ? "question" : "questions"} left — share more about what you're looking for, your privacy preferences, and a few personal touches.`
          : "Share more about what you're looking for, your privacy preferences, and a few personal touches."}
      </p>
      <Link
        href="/profile/edit?theme=connections"
        className="colourful-landing-btn-primary mt-5 inline-block rounded-2xl border-none bg-[#1C1D1E] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#2F9CFA]"
      >
        Complete profile
      </Link>
    </ProfileCard>
  );
}

export function ProfileContent() {
  const { user, loading: userLoading } = useUser();
  const { profile, loading: profileLoading } = useProfile();
  const { logout, signingOut } = useLogout();

  const loading = userLoading || profileLoading;
  const appName = env.NEXT_PUBLIC_APP_NAME;

  if (loading) {
    return <ProfileLoadingSkeleton />;
  }

  if (!user) {
    return (
      <div className="whisper-feed mx-auto max-w-2xl space-y-6 py-2 sm:py-4">
        <ProfileHeader />
        <ProfileEmptyState
          description="You're not signed in yet."
          actionLabel="Log in"
          actionHref="/login"
        />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="whisper-feed mx-auto max-w-2xl space-y-6 py-2 sm:py-4">
        <ProfileHeader />
        <ProfileEmptyState
          description="Your profile isn't set up yet."
          actionLabel="Complete onboarding"
          actionHref="/onboarding"
        />
      </div>
    );
  }

  const answers = profile.onboarding_answers ?? {};
  const hasPreferenceTags =
    (answers.values?.length ?? 0) > 0 ||
    (answers.topics?.length ?? 0) > 0 ||
    (answers.communicationStyles?.length ?? 0) > 0;
  const showCompleteProfilePrompt =
    !hasCompleteProfileAnswers(answers) &&
    COMPLETE_PROFILE_FIELD_IDS.length > 0;
  const pendingCompleteCount = getPendingCompleteProfileQuestions(
    profileToOnboardingProfile(profile)
  ).length;

  const initial = profile.username.charAt(0).toUpperCase();

  return (
    <div className="whisper-feed mx-auto max-w-2xl py-2 sm:py-4">
      <ProfileHeader showEdit />

      <main className="space-y-6 py-4">
        <ProfileCard className="flex items-center gap-6 p-6 sm:p-8">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#2F9CFA] text-2xl font-extrabold text-white">
            {initial}
          </div>
          <div className="min-w-0 space-y-1">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#1C1D1E]">
              @{profile.username}
            </h2>
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#1C1D1E]/45">
              Member since {formatMemberSince(profile.created_at)}
            </p>
            <p
              className={cn(
                "text-sm font-medium italic leading-relaxed",
                profile.bio ? "text-[#1C1D1E]/65" : "text-[#1C1D1E]/40"
              )}
            >
              {profile.bio ? `"${profile.bio}"` : "No bio yet."}
            </p>
          </div>
        </ProfileCard>
        
        <ProfileCard className="relative flex flex-col justify-between gap-6 overflow-hidden p-6 sm:flex-row sm:items-center sm:p-8">
          <div
            className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-[#2F9CFA] opacity-10 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative z-10 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="text-xl font-extrabold tracking-tight text-[#1C1D1E]">
                {appName}
                <span className="text-[#2F9CFA]">+</span>
              </h3>
              <span className="inline-block rounded-full border border-[#1C1D1E]/10 bg-[#EDF0F1] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#1C1D1E]/50">
                Active: Free Plan
              </span>
            </div>
            <p className="max-w-md text-xs font-medium leading-relaxed text-[#1C1D1E]/55">
              You&apos;re currently in our standard free sanctuary. Upgrade to{" "}
              {appName}+ to explore deeper resonances, send unlimited echoes,
              and access advanced terminal options.
            </p>
          </div>
          <button
            type="button"
            className="colourful-landing-btn-primary relative z-10 w-full rounded-2xl border-none bg-[#1C1D1E] px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#2F9CFA] sm:w-auto"
          >
            Upgrade to {appName}+
          </button>
        </ProfileCard>

        <ProfileCard className="grid grid-cols-2 gap-8 p-6 sm:p-8">
          <ProfileField label="Age Range" value={profile.age_range} />
          <ProfileField
            label="Gender"
            value={getProfileGenderLabel(profile)}
          />
          <ProfileField label="Country" value={profile.country} />
          <ProfileField
            label="Email"
            value={user.email ?? "—"}
            className="col-span-2 border-t border-[#1C1D1E]/[0.06] pt-4"
            valueClassName="text-[#2F9CFA]"
          />
        </ProfileCard>

        {hasPreferenceTags ? (
          <ProfileCard className="space-y-6 p-6 sm:p-8">
            <div>
              <h3 className="text-base font-extrabold tracking-tight text-[#1C1D1E]">
                Personality & preferences
              </h3>
              <p className="mt-1 text-xs font-medium text-[#1C1D1E]/45">
                From your onboarding answers.
              </p>
            </div>

            <ProfileTagList
              label="Values you live by"
              tags={answers.values ?? []}
            />
            <ProfileTagList
              label="Curious to explore"
              tags={answers.topics ?? []}
            />
            <ProfileTagList
              label="Communication style"
              tags={answers.communicationStyles ?? []}
            />
          </ProfileCard>
        ) : null}

        <CompleteProfileSection answers={answers} />

        {showCompleteProfilePrompt ? (
          <CompleteProfilePrompt pendingCount={pendingCompleteCount} />
        ) : null}

        

        <button
          type="button"
          onClick={() => void logout()}
          disabled={signingOut}
          className="w-full rounded-2xl border border-[#1C1D1E]/10 bg-white py-3 text-[10px] font-bold uppercase tracking-widest text-[#1C1D1E]/55 transition-all hover:border-red-200 hover:bg-red-50 hover:text-red-500 disabled:opacity-50"
        >
          {signingOut ? "Logging out…" : "Log out"}
        </button>
      </main>
    </div>
  );
}
