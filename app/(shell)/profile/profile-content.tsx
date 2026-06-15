"use client";

import Link from "next/link";
import { useLogout } from "@/hooks/use-logout";
import { useProfile } from "@/hooks/use-profile";
import { useUser } from "@/hooks/use-user";
import { env } from "@/lib/env";
import { getProfileGenderLabel } from "@/lib/profile-mapper";
import { cn } from "@/lib/utils";

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
      <label className="block font-landing-mono text-[10px] uppercase tracking-widest text-gray-600">
        {label}
      </label>
      <span className={cn("text-sm font-light", valueClassName)}>{value}</span>
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
        "rounded-2xl border border-landing-border bg-landing-card",
        className
      )}
    >
      {children}
    </section>
  );
}

function ProfileLoadingSkeleton() {
  return (
    <div className="whisper-feed mx-auto max-w-2xl animate-pulse space-y-6 px-1 sm:px-2">
      <div className="flex items-end justify-between pt-4">
        <div className="h-10 w-32 rounded bg-landing-card" />
        <div className="h-3 w-20 rounded bg-landing-card" />
      </div>
      <div className="h-36 rounded-2xl bg-landing-card" />
      <div className="h-32 rounded-2xl bg-landing-card" />
      <div className="h-48 rounded-2xl bg-landing-card" />
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
      <p className="text-sm text-landing-muted">{description}</p>
      <Link
        href={actionHref}
        className="mt-5 inline-block rounded-lg bg-white px-6 py-2.5 font-landing-mono text-xs font-semibold uppercase tracking-wider text-black transition-colors hover:bg-landing-gold"
      >
        {actionLabel}
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
      <div className="whisper-feed mx-auto max-w-2xl space-y-6 px-1 sm:px-2">
        <header className="flex items-end justify-between pt-4 pb-2">
          <h1 className="font-landing-serif text-4xl text-white">Profile</h1>
        </header>
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
      <div className="whisper-feed mx-auto max-w-2xl space-y-6 px-1 sm:px-2">
        <header className="flex items-end justify-between pt-4 pb-2">
          <h1 className="font-landing-serif text-4xl text-white">Profile</h1>
        </header>
        <ProfileEmptyState
          description="Your profile isn't set up yet."
          actionLabel="Complete onboarding"
          actionHref="/onboarding"
        />
      </div>
    );
  }

  const initial = profile.username.charAt(0).toUpperCase();

  return (
    <div className="whisper-feed mx-auto max-w-2xl px-1 sm:px-2">
      <header className="flex items-end justify-between p-2 pt-4 pb-2">
        <h1 className="font-landing-serif text-4xl text-white">Profile</h1>
        <Link
          href="/onboarding"
          className="pb-1 font-landing-mono text-[10px] uppercase tracking-widest text-gray-500 transition-colors hover:text-white"
        >
          Edit profile
        </Link>
      </header>

      <main className="space-y-6 py-4">
        <ProfileCard className="flex items-center space-x-6 p-8">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-landing-border bg-gray-900 font-landing-serif text-2xl text-landing-muted">
            {initial}
          </div>
          <div className="min-w-0 space-y-1">
            <h2 className="text-2xl font-medium tracking-tight text-white">
              @{profile.username}
            </h2>
            <p className="font-landing-mono text-[10px] font-bold uppercase tracking-widest text-gray-500">
              Member since {formatMemberSince(profile.created_at)}
            </p>
            <p
              className={cn(
                "font-landing-serif text-sm italic",
                profile.bio ? "text-gray-400" : "text-gray-600"
              )}
            >
              {profile.bio ? `"${profile.bio}"` : "No bio yet."}
            </p>
          </div>
        </ProfileCard>

        <ProfileCard className="relative flex flex-col justify-between gap-6 overflow-hidden p-8 sm:flex-row sm:items-center">
          <div
            className="pointer-events-none absolute right-0 top-0 h-32 w-32 opacity-5 blur-3xl"
            style={{ backgroundColor: "#d4c391" }}
            aria-hidden="true"
          />
          <div className="relative z-10 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-landing-serif text-xl tracking-tight text-white">
                {appName}
                <span className="font-semibold italic text-landing-gold">+</span>
              </h3>
              <span className="inline-block rounded border border-landing-border bg-gray-950 px-2.5 py-0.5 font-landing-mono text-[9px] uppercase tracking-wider text-gray-400">
                Active: Free Plan
              </span>
            </div>
            <p className="max-w-md text-xs font-light leading-relaxed text-gray-500">
              You&apos;re currently in our standard free sanctuary. Upgrade to{" "}
              {appName}+ to explore deeper resonances, send unlimited echoes,
              and access advanced terminal options.
            </p>
          </div>
          <button
            type="button"
            className="relative z-10 w-full rounded-lg bg-white px-6 py-3 font-landing-mono text-[10px] font-bold uppercase tracking-wider text-black shadow-lg shadow-black/40 transition-colors hover:bg-landing-gold sm:w-auto"
          >
            Upgrade to {appName}+
          </button>
        </ProfileCard>

        <ProfileCard className="grid grid-cols-2 gap-8 p-8">
          <ProfileField label="Age Range" value={profile.age_range} />
          <ProfileField
            label="Gender"
            value={getProfileGenderLabel(profile)}
          />
          <ProfileField label="Country" value={profile.country} />
          <ProfileField
            label="Email"
            value={user.email ?? "—"}
            className="col-span-2 border-t border-landing-border pt-4"
            valueClassName="font-landing-mono text-landing-gold"
          />
        </ProfileCard>

        <button
          type="button"
          onClick={() => void logout()}
          disabled={signingOut}
          className="w-full rounded-xl border border-landing-border bg-gray-900 py-3 font-landing-mono text-[10px] uppercase tracking-widest text-gray-300 transition-all hover:border-red-900 hover:bg-gray-800 hover:text-red-300 disabled:opacity-50"
        >
          {signingOut ? "Logging out…" : "Log out"}
        </button>
      </main>
    </div>
  );
}
