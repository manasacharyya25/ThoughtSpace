"use client";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  ageRanges,
  countries,
  GENDER_SELF_DESCRIBE,
  genderOptions,
} from "@/data/onboarding-options";
import { BIO_MAX_LENGTH } from "@/lib/onboarding-validation";
import { cn } from "@/lib/utils";
import type { OnboardingProfile, OnboardingStepId } from "@/types/onboarding-profile";
import { OptionGrid } from "./option-grid";

interface StepContentProps {
  step: OnboardingStepId;
  profile: OnboardingProfile;
  onChange: (updates: Partial<OnboardingProfile>) => void;
  error?: string;
}

export function OnboardingStepContent({
  step,
  profile,
  onChange,
  error,
}: StepContentProps) {
  switch (step) {
    case "username":
      return (
        <Input
          label="Username"
          placeholder="thoughtful_mind"
          value={profile.username}
          onChange={(e) =>
            onChange({ username: e.target.value.toLowerCase() })
          }
          error={error}
          autoFocus
          autoComplete="username"
        />
      );

    case "age":
      return (
        <div className="space-y-2">
          <OptionGrid
            options={ageRanges}
            value={profile.ageRange}
            onChange={(ageRange) => onChange({ ageRange })}
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      );

    case "gender":
      return (
        <div className="space-y-4">
          <OptionGrid
            options={genderOptions}
            value={profile.gender}
            onChange={(gender) =>
              onChange({
                gender,
                genderCustom:
                  gender === GENDER_SELF_DESCRIBE ? profile.genderCustom : "",
              })
            }
            columns={2}
          />
          {profile.gender === GENDER_SELF_DESCRIBE && (
            <Input
              label="Your identity"
              placeholder="e.g. demigirl, bigender, queer..."
              value={profile.genderCustom}
              onChange={(e) => onChange({ genderCustom: e.target.value })}
              autoFocus
            />
          )}
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      );

    case "country":
      return (
        <div className="space-y-2">
          <OptionGrid
            options={countries}
            value={profile.country}
            onChange={(country) => onChange({ country })}
            columns={2}
          />
          {error && <p className="text-xs text-red-400">{error}</p>}
        </div>
      );

    case "bio":
      return (
        <div className="space-y-2">
          <Textarea
            label="Short bio"
            placeholder="I'm curious about late-night conversations, unfinished ideas, and the questions we rarely ask out loud..."
            rows={4}
            value={profile.bio}
            onChange={(e) => onChange({ bio: e.target.value })}
            error={error}
            autoFocus
          />
          <p
            className={cn(
              "text-right text-[11px] tabular-nums",
              profile.bio.length > BIO_MAX_LENGTH
                ? "text-red-400"
                : "text-muted-foreground"
            )}
          >
            {profile.bio.length}/{BIO_MAX_LENGTH}
          </p>
        </div>
      );

    default:
      return null;
  }
}
