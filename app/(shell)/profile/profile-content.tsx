"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { useLogout } from "@/hooks/use-logout";
import { useProfile } from "@/hooks/use-profile";
import { useUser } from "@/hooks/use-user";
import { getProfileGenderLabel } from "@/lib/profile-mapper";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
  }).format(new Date(date));
}

export function ProfileContent() {
  const { user, loading: userLoading } = useUser();
  const { profile, loading: profileLoading } = useProfile();
  const { logout, signingOut } = useLogout();

  const loading = userLoading || profileLoading;

  if (loading) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeader title="Profile" description="Manage your account settings" />
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    );
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
          <Card padding="lg" className="text-center">
            <p className="text-sm text-muted-foreground">
              You&apos;re not signed in yet.
            </p>
            <Link href="/login" className="mt-4 inline-block">
              <Button size="sm">Log in</Button>
            </Link>
          </Card>
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
          <Card padding="lg" className="text-center">
            <p className="text-sm text-muted-foreground">
              Your profile isn&apos;t set up yet.
            </p>
            <Link href="/onboarding" className="mt-4 inline-block">
              <Button size="sm">Complete onboarding</Button>
            </Link>
          </Card>
        </FadeIn>
      </div>
    );
  }

  const initial = profile.username.charAt(0).toUpperCase();

  return (
    <div className="mx-auto max-w-2xl">
      <FadeIn index={0}>
        <PageHeader
          title="Profile"
          description="Manage your account settings"
          action={<Button variant="outline" size="sm">Edit profile</Button>}
        />
      </FadeIn>

      <FadeIn index={1}>
        <Card padding="lg">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full border border-border bg-muted text-lg font-medium">
              {initial}
            </div>
            <div>
              <h2 className="text-lg font-semibold">@{profile.username}</h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>

          <CardContent className="mt-6 space-y-4 p-0">
            <div>
              <p className="text-xs text-muted-foreground">Bio</p>
              <p className="mt-1 text-sm">{profile.bio}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="mt-1 text-sm">{user.email ?? "—"}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Age range</p>
              <p className="mt-1 text-sm">{profile.age_range}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Gender</p>
              <p className="mt-1 text-sm">{getProfileGenderLabel(profile)}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Country</p>
              <p className="mt-1 text-sm">{profile.country}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Signed in with</p>
              <p className="mt-1 text-sm capitalize">
                {user.app_metadata?.provider ?? "email"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Member since</p>
              <p className="mt-1 text-sm">
                {formatDate(profile.created_at)}
              </p>
            </div>
          </CardContent>
        </Card>
      </FadeIn>

      <FadeIn index={2}>
        <Button
          type="button"
          className="mt-6 w-full md:hidden"
          onClick={logout}
          disabled={signingOut}
        >
          {signingOut ? "Logging out…" : "Log out"}
        </Button>
      </FadeIn>
    </div>
  );
}
