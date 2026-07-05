import { Calendar, Globe } from "lucide-react";
import { GenderIcon } from "@/lib/gender-icon";
import {
  getPostAuthorBadgeAriaLabel,
  getPostAuthorBadgeData,
} from "@/lib/post-author-badge";
import { cn } from "@/lib/utils";
import type { PostAuthorPreview } from "@/types/post";

interface PostAuthorBadgeProps {
  author: PostAuthorPreview;
  className?: string;
}

function BadgeSegment({
  children,
  className,
  tone = "neutral",
}: {
  children: React.ReactNode;
  className?: string;
  tone?: "mint" | "blue" | "lilac" | "neutral";
}) {
  const toneClass = {
    mint: "bg-[#E8F8F0]/90 text-[#2D6A4F]",
    blue: "bg-[#EBF5FF]/90 text-[#1B6FA8]",
    lilac: "bg-[#F3E8FF]/90 text-[#7C5CBF]",
    neutral: "bg-white/80 text-[#1C1D1E]/70",
  }[tone];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-1 text-[10px] font-semibold leading-none sm:px-2.5 sm:text-[11px]",
        toneClass,
        className
      )}
    >
      {children}
    </span>
  );
}

export function PostAuthorBadge({ author, className }: PostAuthorBadgeProps) {
  const data = getPostAuthorBadgeData(author);
  if (!data) return null;

  const ariaLabel = getPostAuthorBadgeAriaLabel(data);
  const showCountry = Boolean(data.countryName);
  const showAge = Boolean(data.ageRange);
  const showGender = Boolean(data.genderLabel || data.genderCustom);

  return (
    <span
      className={cn(
        "inline-flex max-w-[46%] shrink-0 overflow-hidden rounded-full border border-[#1C1D1E]/[0.08] bg-white/95 shadow-[0_4px_12px_-6px_rgba(28,29,30,0.18)] backdrop-blur-sm sm:max-w-none",
        className
      )}
      title={ariaLabel}
      aria-label={ariaLabel}
    >
      {showCountry ? (
        <BadgeSegment tone="mint" className="gap-1.5">
          {data.countryFlag ? (
            <span className="text-[14px] leading-none" aria-hidden="true">
              {data.countryFlag}
            </span>
          ) : (
            <Globe
              className="size-3 shrink-0 text-[#5FAF7A]"
              strokeWidth={2.25}
              aria-hidden="true"
            />
          )}
          <span className="hidden max-w-[5rem] truncate sm:inline">
            {data.countryName === "Other" ? "Global" : data.countryName}
          </span>
        </BadgeSegment>
      ) : null}

      {showAge ? (
        <BadgeSegment
          tone="blue"
          className={cn(showCountry && "border-l border-[#1C1D1E]/[0.06]")}
        >
          <Calendar
            className="size-3 shrink-0 text-[#2F9CFA]"
            strokeWidth={2.25}
            aria-hidden="true"
          />
          <span className="whitespace-nowrap">{data.ageRange}</span>
        </BadgeSegment>
      ) : null}

      {showGender ? (
        <BadgeSegment
          tone="lilac"
          className={cn(
            (showCountry || showAge) && "border-l border-[#1C1D1E]/[0.06]"
          )}
        >
          <GenderIcon
            gender={data.gender}
            genderCustom={data.genderCustom}
            className="size-3 text-[#9C7BD4]"
          />
          {data.genderLabel ? (
            <span className="hidden max-w-[5.5rem] truncate sm:inline">
              {data.genderLabel}
            </span>
          ) : null}
        </BadgeSegment>
      ) : null}
    </span>
  );
}
