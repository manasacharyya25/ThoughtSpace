"use client";

import Link from "next/link";
import { Pencil, Sparkles } from "lucide-react";
import { PostAuthorAvatar } from "@/components/feed/post-author-avatar";
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
import {
  ProfileIconBadge,
  ProfileSectionHeader,
  type ProfileFieldKey,
  profileCardAccent,
} from "@/components/profile/profile-field-meta";
import "@/components/landing/colourful-landing.css";

function formatMemberSince(date: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
  }).format(new Date(date));
}

function ProfileField({
  fieldKey,
  label,
  value,
  className,
  valueClassName,
}: {
  fieldKey: ProfileFieldKey;
  label: string;
  value: string;
  className?: string;
  valueClassName?: string;
}) {
  return (
    <div className={cn("flex gap-3", className)}>
      <ProfileIconBadge fieldKey={fieldKey} />
      <div className="min-w-0 flex-1 space-y-1">
        <label className="block text-[0.65rem] font-extrabold uppercase tracking-[1.2px] text-[#1C1D1E]/50">
          {label}
        </label>
        <span
          className={cn(
            "text-sm font-medium leading-relaxed text-[#1C1D1E]/80",
            valueClassName
          )}
        >
          {value}
        </span>
      </div>
    </div>
  );
}

function ProfileTagList({
  fieldKey,
  label,
  tags,
}: {
  fieldKey: ProfileFieldKey;
  label: string;
  tags: string[];
}) {
  if (tags.length === 0) return null;

  return (
    <div className="flex gap-3">
      <ProfileIconBadge fieldKey={fieldKey} className="mt-0.5" />
      <div className="min-w-0 flex-1 space-y-2">
        <label className="block text-[0.65rem] font-extrabold uppercase tracking-[1.2px] text-[#1C1D1E]/50">
          {label}
        </label>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-[#2F9CFA]/20 bg-[#EBF5FF] px-3 py-1 text-[11px] font-semibold text-[#1C1D1E]/80"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProfileCard({
  children,
  className,
  accentKey,
}: {
  children: React.ReactNode;
  className?: string;
  accentKey?: ProfileFieldKey;
}) {
  return (
    <section
      className={cn(
        "whisper-card overflow-hidden rounded-[20px] border border-[#1C1D1E]/[0.03] bg-white shadow-[0_24px_48px_-12px_rgba(28,29,30,0.08)]",
        accentKey &&
          cn("bg-gradient-to-br", profileCardAccent(accentKey)),
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
    <ProfileCard className="p-8 text-center" accentKey="username">
      <ProfileIconBadge fieldKey="username" size="lg" className="mx-auto" />
      <p className="mt-4 text-sm font-medium text-[#1C1D1E]/55">{description}</p>
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
          className="inline-flex items-center gap-1.5 pb-1 text-[10px] font-bold uppercase tracking-widest text-[#1C1D1E]/45 transition-colors hover:text-[#2F9CFA]"
        >
          <Pencil className="size-3" aria-hidden="true" />
          Edit profile
        </Link>
      )}
    </header>
  );
}

const completeProfileFieldMeta: Partial<
  Record<
    (typeof COMPLETE_PROFILE_FIELD_IDS)[number],
    { label: string; fieldKey: ProfileFieldKey }
  >
> = {
  impact: { label: "Impact you want to make", fieldKey: "impact" },
  hobbies: { label: "Hobbies & activities", fieldKey: "hobbies" },
  conversationMeaning: {
    label: "Meaningful conversations",
    fieldKey: "conversationMeaning",
  },
  conversationDepth: {
    label: "Conversation depth",
    fieldKey: "conversationDepth",
  },
  connectionGoals: { label: "Connection goals", fieldKey: "connectionGoals" },
  greatConnection: { label: "Ideal connection", fieldKey: "greatConnection" },
  comfortableSharing: {
    label: "Comfortable sharing",
    fieldKey: "comfortableSharing",
  },
  displayPreference: {
    label: "Display preference",
    fieldKey: "displayPreference",
  },
  contentVisibility: {
    label: "Content visibility",
    fieldKey: "contentVisibility",
  },
  surpriseFact: { label: "Surprise fact", fieldKey: "surpriseFact" },
  quote: { label: "Quote or idea", fieldKey: "quote" },
  superpower: { label: "Superpower", fieldKey: "superpower" },
};

function CompleteProfileSection({ answers }: { answers: OnboardingAnswers }) {
  const textFields = (
    [
      "impact",
      "hobbies",
      "conversationMeaning",
      "conversationDepth",
      "greatConnection",
      "displayPreference",
      "contentVisibility",
      "surpriseFact",
      "quote",
      "superpower",
    ] as const
  )
    .map((id) => {
      const meta = completeProfileFieldMeta[id];
      const value = answers[id];
      if (!meta || !value) return null;
      return { ...meta, value };
    })
    .filter(Boolean) as Array<{
    label: string;
    fieldKey: ProfileFieldKey;
    value: string;
  }>;

  const tagFields = (
    [
      { id: "connectionGoals" as const, tags: answers.connectionGoals ?? [] },
      {
        id: "comfortableSharing" as const,
        tags: answers.comfortableSharing ?? [],
      },
    ] as const
  )
    .map(({ id, tags }) => {
      const meta = completeProfileFieldMeta[id];
      if (!meta || tags.length === 0) return null;
      return { ...meta, tags };
    })
    .filter(Boolean) as Array<{
    label: string;
    fieldKey: ProfileFieldKey;
    tags: string[];
  }>;

  if (textFields.length === 0 && tagFields.length === 0) return null;

  return (
    <ProfileCard className="space-y-6 p-6 sm:p-8" accentKey="moreAboutYou">
      <ProfileSectionHeader
        fieldKey="moreAboutYou"
        title="More about you"
        description="Additional details from your profile."
      />

      {tagFields.map((field) => (
        <ProfileTagList
          key={field.fieldKey}
          fieldKey={field.fieldKey}
          label={field.label}
          tags={field.tags}
        />
      ))}

      {textFields.map((field) => (
        <ProfileField
          key={field.fieldKey}
          fieldKey={field.fieldKey}
          label={field.label}
          value={field.value}
        />
      ))}
    </ProfileCard>
  );
}

function CompleteProfilePrompt({ pendingCount }: { pendingCount: number }) {
  return (
    <ProfileCard
      className="border border-dashed border-[#2F9CFA]/25 bg-[#EBF5FF]/40 p-6 sm:p-8"
      accentKey="completeProfile"
    >
      <ProfileSectionHeader
        fieldKey="completeProfile"
        title="Complete your profile"
        description={
          pendingCount > 0
            ? `${pendingCount} optional ${pendingCount === 1 ? "question" : "questions"} left — share more about connections, conversation style, and personal touches.`
            : "Share more about connections, conversation style, and personal touches."
        }
      />
      <Link
        href="/profile/edit?theme=connections"
        className="colourful-landing-btn-primary mt-5 inline-flex items-center gap-2 rounded-2xl border-none bg-[#1C1D1E] px-6 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#2F9CFA]"
      >
        <Sparkles className="size-3.5" aria-hidden="true" />
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

  return (
    <div className="whisper-feed mx-auto max-w-2xl py-2 sm:py-4">
      <ProfileHeader showEdit />

      <main className="space-y-6 py-4">
        <ProfileCard
          className="relative flex items-center gap-6 overflow-hidden p-6 sm:p-8"
          accentKey="username"
        >
          <div
            className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#2F9CFA]/15 blur-2xl"
            aria-hidden="true"
          />
          <PostAuthorAvatar name={profile.username} size={80} />
          <div className="relative min-w-0 flex-1 space-y-2">
            <h2 className="text-2xl font-extrabold tracking-tight text-[#1C1D1E]">
              @{profile.username}
            </h2>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#1C1D1E]/45">
              <ProfileIconBadge fieldKey="memberSince" size="sm" />
              <span>Member since {formatMemberSince(profile.created_at)}</span>
            </div>
            <div className="flex gap-3">
              <ProfileIconBadge fieldKey="bio" size="sm" className="mt-0.5" />
              <p
                className={cn(
                  "text-sm font-medium italic leading-relaxed",
                  profile.bio ? "text-[#1C1D1E]/65" : "text-[#1C1D1E]/40"
                )}
              >
                {profile.bio ? `"${profile.bio}"` : "No bio yet."}
              </p>
            </div>
          </div>
        </ProfileCard>

        <ProfileCard
          className="relative flex flex-col justify-between gap-6 overflow-hidden p-6 sm:flex-row sm:items-center sm:p-8"
          accentKey="plan"
        >
          <div
            className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-[#FFAB91]/20 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative z-10 flex gap-3">
            <ProfileIconBadge fieldKey="plan" />
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-xl font-extrabold tracking-tight text-[#1C1D1E]">
                  {appName}
                  <span className="text-[#2F9CFA]">+</span>
                </h3>
                <span className="inline-block rounded-full border border-[#FFAB91]/30 bg-[#FFF0EB] px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#FF8A65]">
                  Active: Free Plan
                </span>
              </div>
              <p className="max-w-md text-xs font-medium leading-relaxed text-[#1C1D1E]/55">
                You&apos;re currently in our standard free sanctuary. Upgrade to{" "}
                {appName}+ to explore deeper resonances, send unlimited echoes,
                and access advanced terminal options.
              </p>
            </div>
          </div>
          <button
            type="button"
            className="colourful-landing-btn-primary relative z-10 w-full rounded-2xl border-none bg-[#1C1D1E] px-6 py-3 text-[10px] font-bold uppercase tracking-wider text-white transition-colors hover:bg-[#2F9CFA] sm:w-auto"
          >
            Upgrade to {appName}+
          </button>
        </ProfileCard>

        <ProfileCard className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 sm:gap-8 sm:p-8">
          <ProfileField
            fieldKey="ageRange"
            label="Age range"
            value={profile.age_range}
          />
          <ProfileField
            fieldKey="gender"
            label="Gender"
            value={getProfileGenderLabel(profile)}
          />
          <ProfileField
            fieldKey="country"
            label="Country"
            value={profile.country}
          />
          <ProfileField
            fieldKey="email"
            label="Email"
            value={user.email ?? "—"}
            className="sm:col-span-2 border-t border-[#1C1D1E]/[0.06] pt-4"
            valueClassName="text-[#2F9CFA]"
          />
        </ProfileCard>

        {hasPreferenceTags ? (
          <ProfileCard className="space-y-6 p-6 sm:p-8" accentKey="personality">
            <ProfileSectionHeader
              fieldKey="personality"
              title="Personality & preferences"
              description="From your onboarding answers."
            />

            <ProfileTagList
              fieldKey="values"
              label="Values you live by"
              tags={answers.values ?? []}
            />
            <ProfileTagList
              fieldKey="topics"
              label="Curious to explore"
              tags={answers.topics ?? []}
            />
            <ProfileTagList
              fieldKey="communicationStyles"
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
