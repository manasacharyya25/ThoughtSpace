import type { ReactNode } from "react";
import {
  Circle,
  HelpCircle,
  Minus,
  Sparkles,
  User,
} from "lucide-react";
import {
  GENDER_PREFER_NOT_TO_SAY,
  GENDER_SELF_DESCRIBE,
} from "@/data/onboarding-options";
import { cn } from "@/lib/utils";

interface GenderIconProps {
  gender: string;
  genderCustom?: string | null;
  className?: string;
}

function GenderSymbol({
  children,
  className,
  label,
}: {
  children: ReactNode;
  className?: string;
  label: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex size-3.5 items-center justify-center text-[11px] font-bold leading-none",
        className
      )}
      aria-label={label}
      role="img"
    >
      {children}
    </span>
  );
}

export function GenderIcon({ gender, genderCustom, className }: GenderIconProps) {
  const iconClass = cn("size-3.5 shrink-0", className);

  if (genderCustom?.trim()) {
    return <User className={iconClass} aria-label={genderCustom} />;
  }

  if (gender === GENDER_PREFER_NOT_TO_SAY) {
    return <Minus className={iconClass} aria-label="Prefer not to say" />;
  }

  if (gender === GENDER_SELF_DESCRIBE) {
    return <User className={iconClass} aria-label="Self-described gender" />;
  }

  if (gender === "Woman") {
    return (
      <GenderSymbol className={className} label="Woman">
        ♀
      </GenderSymbol>
    );
  }

  if (gender === "Man") {
    return (
      <GenderSymbol className={className} label="Man">
        ♂
      </GenderSymbol>
    );
  }

  if (gender === "Questioning") {
    return <HelpCircle className={iconClass} aria-label="Questioning" />;
  }

  if (gender === "Agender") {
    return <Circle className={iconClass} aria-label="Agender" />;
  }

  return <Sparkles className={iconClass} aria-label={gender} />;
}
