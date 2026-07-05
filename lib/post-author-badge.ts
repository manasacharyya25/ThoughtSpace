import {
  GENDER_PREFER_NOT_TO_SAY,
  GENDER_SELF_DESCRIBE,
} from "@/data/onboarding-options";
import type { PostAuthorPreview } from "@/types/post";

/** ISO 3166-1 alpha-2 codes for flag emoji generation */
const COUNTRY_ISO_CODES: Record<string, string> = {
  "United States": "US",
  "United Kingdom": "GB",
  Canada: "CA",
  Australia: "AU",
  Germany: "DE",
  France: "FR",
  India: "IN",
  Japan: "JP",
  Brazil: "BR",
  Mexico: "MX",
  Netherlands: "NL",
  Sweden: "SE",
  Spain: "ES",
  Italy: "IT",
  "South Korea": "KR",
  Singapore: "SG",
  "New Zealand": "NZ",
  Ireland: "IE",
  Portugal: "PT",
};

export function countryCodeToFlagEmoji(code: string): string | null {
  const normalized = code.trim().toUpperCase();
  if (normalized.length !== 2 || !/^[A-Z]{2}$/.test(normalized)) return null;

  return normalized
    .split("")
    .map((char) => String.fromCodePoint(127397 + char.charCodeAt(0)))
    .join("");
}

export function getCountryIsoCode(country: string | undefined): string | null {
  const trimmed = country?.trim();
  if (!trimmed) return null;
  return COUNTRY_ISO_CODES[trimmed] ?? null;
}

export function getCountryFlagEmoji(country: string | undefined): string | null {
  const iso = getCountryIsoCode(country);
  if (!iso) return null;
  return countryCodeToFlagEmoji(iso);
}

export function formatPostAuthorGender(
  author: Pick<PostAuthorPreview, "gender" | "gender_custom">
): string | null {
  if (author.gender_custom?.trim()) return author.gender_custom.trim();
  if (!author.gender?.trim()) return null;
  if (
    author.gender === GENDER_PREFER_NOT_TO_SAY ||
    author.gender === GENDER_SELF_DESCRIBE
  ) {
    return null;
  }
  return author.gender;
}

export function formatPostAuthorAge(ageRange: string | undefined): string | null {
  const trimmed = ageRange?.trim();
  return trimmed || null;
}

export interface PostAuthorBadgeData {
  countryName: string | null;
  countryFlag: string | null;
  ageRange: string | null;
  genderLabel: string | null;
  gender: string;
  genderCustom: string | null;
}

export function getPostAuthorBadgeData(
  author: PostAuthorPreview
): PostAuthorBadgeData | null {
  const countryName = author.country?.trim() || null;
  const countryFlag = getCountryFlagEmoji(countryName ?? undefined);
  const ageRange = formatPostAuthorAge(author.age_range);
  const genderLabel = formatPostAuthorGender(author);

  if (!countryName && !ageRange && !genderLabel) return null;

  return {
    countryName,
    countryFlag,
    ageRange,
    genderLabel,
    gender: author.gender,
    genderCustom: author.gender_custom,
  };
}

export function getPostAuthorBadgeAriaLabel(data: PostAuthorBadgeData): string {
  return [
    data.countryName,
    data.ageRange ? `Age ${data.ageRange}` : null,
    data.genderLabel,
  ]
    .filter(Boolean)
    .join(", ");
}
