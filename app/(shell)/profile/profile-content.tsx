"use client";

import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { FadeIn } from "@/components/ui/fade-in";
import { currentUser } from "@/data";

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "long",
  }).format(new Date(date));
}

export function ProfileContent() {
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
              {currentUser.name.charAt(0)}
            </div>
            <div>
              <h2 className="text-lg font-semibold">{currentUser.name}</h2>
              <p className="text-sm text-muted-foreground">
                @{currentUser.username}
              </p>
            </div>
          </div>

          <CardContent className="mt-6 space-y-4 p-0">
            <div>
              <p className="text-xs text-muted-foreground">Bio</p>
              <p className="mt-1 text-sm">{currentUser.bio}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Email</p>
              <p className="mt-1 text-sm">{currentUser.email}</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Member since</p>
              <p className="mt-1 text-sm">
                {formatDate(currentUser.createdAt)}
              </p>
            </div>
          </CardContent>
        </Card>
      </FadeIn>
    </div>
  );
}
