import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Container } from "@/components/layout/container";
import { onboardingSteps } from "@/data";

export const metadata: Metadata = {
  title: "Onboarding",
};

export default function OnboardingPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <Container size="sm" className="w-full">
        <Card padding="lg">
          <div className="space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Set up your profile
              </h1>
              <p className="text-sm text-muted-foreground">
                Complete these steps to personalize your experience
              </p>
            </div>

            <div className="space-y-3">
              {onboardingSteps.map((step, i) => (
                <div
                  key={step.id}
                  className="flex gap-3 rounded-md border border-border p-3"
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border text-xs">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-medium">{step.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <Card>
              <CardContent>
                <form className="space-y-4">
                  <Input label="Display name" placeholder="Alex Morgan" />
                  <Input label="Username" placeholder="alexm" />
                  <Textarea
                    label="Bio"
                    placeholder="Tell us a bit about yourself..."
                    rows={3}
                  />
                </form>
              </CardContent>
            </Card>

            <Link href="/feed" className="block">
              <Button className="w-full">Continue to feed</Button>
            </Link>
          </div>
        </Card>
      </Container>
    </div>
  );
}
