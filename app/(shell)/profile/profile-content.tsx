"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { VioletSeparator } from "@/components/ui/violet-separator";
import { useLogout } from "@/hooks/use-logout";
import { useProfile } from "@/hooks/use-profile";
import { useUser } from "@/hooks/use-user";
import { getProfileGenderLabel } from "@/lib/profile-mapper";
import { cn } from "@/lib/utils";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
  }).format(new Date(date));
}

function ProfileField({
  label,
  value,
  className,
}: {
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1", className)}>
      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50">
        {label}
      </p>
      <p className="text-sm text-foreground">{value}</p>
    </div>
  );
}

function ProfileLoadingSkeleton() {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 space-y-2">
        <div className="h-8 w-28 animate-pulse rounded-md bg-muted/30" />
      </div>
      <div className="feed-card animate-pulse">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
          <div className="h-20 w-20 shrink-0 rounded-full bg-muted/30" />
          <div className="w-full space-y-3 sm:flex-1">
            <div className="mx-auto h-6 w-36 rounded-md bg-muted/30 sm:mx-0" />
            <div className="mx-auto h-3 w-28 rounded-md bg-muted/20 sm:mx-0" />
            <div className="space-y-2 pt-1">
              <div className="h-3 w-full rounded-md bg-muted/20" />
              <div className="h-3 w-[80%] rounded-md bg-muted/20" />
            </div>
          </div>
        </div>
      </div>
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
    <div className="feed-card py-10 text-center">
      <p className="text-sm text-muted-foreground">{description}</p>
      <Link href={actionHref} className="mt-5 inline-block">
        <Button size="sm">{actionLabel}</Button>
      </Link>
    </div>
  );
}

export function ProfileContent() {
  const { user, loading: userLoading } = useUser();
  const { profile, loading: profileLoading } = useProfile();
  const { logout, signingOut } = useLogout();

  const loading = userLoading || profileLoading;

  if (loading) {
    return <ProfileLoadingSkeleton />;
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl">
        <FadeIn index={0}>
          <PageHeader
            title="Profile"
            description="Sign in to view your account"
          />
        </FadeIn>
        <FadeIn index={1}>
          <ProfileEmptyState
            description="You're not signed in yet."
            actionLabel="Log in"
            actionHref="/login"
          />
        </FadeIn>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-2xl">
        <FadeIn index={0}>
          <PageHeader
            title="Profile"
            description="Complete your profile to get started"
          />
        </FadeIn>
        <FadeIn index={1}>
          <ProfileEmptyState
            description="Your profile isn't set up yet."
            actionLabel="Complete onboarding"
            actionHref="/onboarding"
          />
        </FadeIn>
      </div>
    );
  }

  const initial = profile.username.charAt(0).toUpperCase();
  const provider = user.app_metadata?.provider ?? "email";

  return (
    <div className="mx-auto max-w-2xl">
      <FadeIn index={0}>
        <PageHeader
          title="Profile"
          action={
            <Link href="/onboarding">
              <Button variant="outline" size="sm">
                Edit profile
              </Button>
            </Link>
          }
        />
      </FadeIn>

      <FadeIn index={1}>
        <article className="feed-card">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border border-border/40 bg-muted/30 text-2xl font-medium text-foreground ring-1 ring-violet-500/10">
              {initial}
            </div>
            <div className="min-w-0 flex-1 space-y-2">
              <h2 className="text-xl font-semibold tracking-tight text-heading">
                @{profile.username}
              </h2>
              <p className="text-[11px] text-muted-foreground/60">
                Member since {formatDate(profile.created_at)}
              </p>
              <p
                className={cn(
                  "text-[15px] leading-relaxed",
                  profile.bio
                    ? "text-foreground/90"
                    : "italic text-muted-foreground/50"
                )}
              >
                {profile.bio || "No bio yet."}
              </p>
            </div>
          </div>
        </article>
      </FadeIn>

      <FadeIn index={2}>
        <VioletSeparator className="my-6" />
      </FadeIn>

      <FadeIn index={3}>
        <section className="feed-card space-y-5">
          <h3 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50">
            About
          </h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <ProfileField label="Age range" value={profile.age_range} />
            <ProfileField
              label="Gender"
              value={getProfileGenderLabel(profile)}
            />
            <ProfileField
              label="Country"
              value={profile.country}
              className="sm:col-span-2"
            />
          </div>
        </section>
      </FadeIn>

      <FadeIn index={4}>
        <section className="mt-4 feed-card space-y-5 border-border/20">
          <h3 className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/50">
            Account
          </h3>
          <div className="grid gap-5 sm:grid-cols-2">
            <ProfileField
              label="Email"
              value={user.email ?? "—"}
              className="sm:col-span-2"
            />
            <ProfileField
              label="Signed in with"
              value={provider.charAt(0).toUpperCase() + provider.slice(1)}
            />
          </div>
          <div className="flex justify-stretch pt-1 sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="w-full sm:w-auto"
              onClick={logout}
              disabled={signingOut}
            >
              {signingOut ? "Logging out…" : "Log out"}
            </Button>
          </div>
        </section>
      </FadeIn>
    </div>
  );
}
