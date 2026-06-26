"use client";

import { useEffect, useRef, useState } from "react";
import { GENDER_SELF_DESCRIBE } from "@/data/onboarding-options";
import { cn } from "@/lib/utils";
import type {
  OnboardingProfile,
  OnboardingQuestion,
  ProfileEditTheme,
} from "@/types/onboarding-profile";

const inputClassName =
  "h-10 w-full rounded-[14px] border-2 border-transparent bg-[#EDF0F1] px-4 text-[clamp(0.7rem,1.35vw,0.79rem)] font-medium text-[#1C1D1E] placeholder:text-[#1C1D1E]/35 focus-visible:border-[#2F9CFA] focus-visible:bg-white focus-visible:outline-none focus-visible:ring-[4px] focus-visible:ring-[#2F9CFA]/10";

const textareaClassName =
  "w-full resize-none rounded-[14px] border-2 border-transparent bg-[#EDF0F1] px-4 py-3 text-[clamp(0.7rem,1.35vw,0.79rem)] font-medium leading-relaxed text-[#1C1D1E] placeholder:text-[#1C1D1E]/35 focus-visible:border-[#2F9CFA] focus-visible:bg-white focus-visible:outline-none focus-visible:ring-[4px] focus-visible:ring-[#2F9CFA]/10";

const labelClassName =
  "text-[0.65rem] font-extrabold uppercase tracking-[1.2px] text-[#1C1D1E]/50";

function CheckIcon() {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 13l4 4L19 7" />
    </svg>
  );
}

interface OptionCardProps {
  label: string;
  selected: boolean;
  onClick: () => void;
}

function OptionCard({ label, selected, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center justify-between gap-3 rounded-[14px] border-2 px-4 py-3 text-left text-[clamp(0.7rem,1.35vw,0.79rem)] font-medium transition-colors",
        selected
          ? "border-[#2F9CFA] bg-[#2F9CFA]/[0.06] text-[#1C1D1E]"
          : "border-transparent bg-[#EDF0F1] text-[#1C1D1E]/75 hover:bg-[#E4E8EA]"
      )}
    >
      <span>{label}</span>
      <span
        className={cn(
          "flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
          selected
            ? "border-[#2F9CFA] bg-[#2F9CFA] text-white"
            : "border-[#1C1D1E]/15 bg-white text-transparent"
        )}
      >
        {selected ? <CheckIcon /> : null}
      </span>
    </button>
  );
}

function shouldUseTwoColumnOptions(question: OnboardingQuestion) {
  return (
    question.id === "ageRange" ||
    question.id === "gender" ||
    (question.options?.length ?? 0) > 6
  );
}

interface CountrySearchSelectProps {
  id: string;
  value: string;
  options: readonly string[];
  onChange: (value: string) => void;
}

const COUNTRY_DROPDOWN_LIMIT = 7;

function CountrySearchSelect({
  id,
  value,
  options,
  onChange,
}: CountrySearchSelectProps) {
  const [query, setQuery] = useState(value);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const listId = `${id}-list`;

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setQuery(value);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [value]);

  const matchingCountries = options.filter((country) =>
    country.toLowerCase().includes(query.trim().toLowerCase())
  );
  const visibleCountries = matchingCountries.slice(0, COUNTRY_DROPDOWN_LIMIT);

  return (
    <div ref={containerRef} className="relative z-10">
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls={listId}
        aria-autocomplete="list"
        className={inputClassName}
        placeholder="Type to search countries…"
        value={query}
        onChange={(event) => {
          setQuery(event.target.value);
          setIsOpen(true);
          if (!event.target.value.trim()) {
            onChange("");
          }
        }}
        onFocus={() => setIsOpen(true)}
      />

      {isOpen ? (
        matchingCountries.length > 0 ? (
          <ul
            id={listId}
            role="listbox"
            className="absolute z-50 mt-1 w-full overflow-hidden rounded-[14px] border border-[#1C1D1E]/10 bg-white py-1 shadow-[0_12px_32px_-8px_rgba(28,29,30,0.15)]"
          >
            {visibleCountries.map((country) => (
              <li key={country} role="option" aria-selected={value === country}>
                <button
                  type="button"
                  className={cn(
                    "w-full px-4 py-2.5 text-left text-[clamp(0.7rem,1.35vw,0.79rem)] font-medium transition-colors hover:bg-[#EDF0F1]",
                    value === country
                      ? "bg-[#2F9CFA]/10 text-[#1C1D1E]"
                      : "text-[#1C1D1E]/75"
                  )}
                  onClick={() => {
                    onChange(country);
                    setQuery(country);
                    setIsOpen(false);
                  }}
                >
                  {country}
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <div className="absolute z-50 mt-1 w-full rounded-[14px] border border-[#1C1D1E]/10 bg-white px-4 py-3 text-[11px] font-medium text-[#1C1D1E]/45 shadow-[0_12px_32px_-8px_rgba(28,29,30,0.15)]">
            No countries match your search.
          </div>
        )
      ) : null}
    </div>
  );
}

interface QuestionFieldProps {
  question: OnboardingQuestion;
  profile: OnboardingProfile;
  onChange: (updates: Partial<OnboardingProfile>) => void;
}

function QuestionField({ question, profile, onChange }: QuestionFieldProps) {
  const stringValue =
    typeof profile[question.id] === "string"
      ? (profile[question.id] as string)
      : "";
  const arrayValue = Array.isArray(profile[question.id])
    ? (profile[question.id] as string[])
    : [];

  if (question.type === "text" || question.type === "textarea") {
    const isUsername = question.id === "username";

    return (
      <div className="space-y-2">
        {question.type === "text" ? (
          <input
            id={question.id}
            type="text"
            className={inputClassName}
            placeholder={question.placeholder}
            value={stringValue}
            onChange={(event) => {
              const value = isUsername
                ? event.target.value.toLowerCase()
                : event.target.value;
              onChange({ [question.id]: value });
            }}
            maxLength={question.maxLength}
            autoComplete={isUsername ? "username" : undefined}
          />
        ) : (
          <textarea
            id={question.id}
            className={textareaClassName}
            placeholder={question.placeholder}
            value={stringValue}
            onChange={(event) => onChange({ [question.id]: event.target.value })}
            rows={question.rows ?? 3}
            maxLength={question.maxLength}
          />
        )}
        {question.maxLength ? (
          <p
            className={cn(
              "text-right text-[11px] tabular-nums",
              stringValue.length > question.maxLength
                ? "text-red-500"
                : "text-[#1C1D1E]/40"
            )}
          >
            {stringValue.length}/{question.maxLength}
          </p>
        ) : null}
      </div>
    );
  }

  if (question.type === "single" && question.options) {
    if (question.id === "country") {
      return (
        <CountrySearchSelect
          id={question.id}
          value={stringValue}
          options={question.options}
          onChange={(country) => onChange({ country })}
        />
      );
    }

    const twoColumns = shouldUseTwoColumnOptions(question);

    return (
      <div className="space-y-2">
        <div
          className={cn(
            "grid gap-2",
            twoColumns ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
          )}
        >
          {question.options.map((option) => (
            <OptionCard
              key={option}
              label={option}
              selected={stringValue === option}
              onClick={() => {
                const updates: Partial<OnboardingProfile> = {
                  [question.id]: option,
                };
                if (question.id === "gender" && option !== GENDER_SELF_DESCRIBE) {
                  updates.genderCustom = "";
                }
                onChange(updates);
              }}
            />
          ))}
        </div>

        {question.id === "gender" && stringValue === GENDER_SELF_DESCRIBE ? (
          <div className="space-y-2 pt-1">
            <label htmlFor="genderCustom" className={labelClassName}>
              Your identity
            </label>
            <input
              id="genderCustom"
              type="text"
              className={inputClassName}
              placeholder="e.g. demigirl, bigender, queer…"
              value={profile.genderCustom}
              onChange={(event) =>
                onChange({ genderCustom: event.target.value })
              }
            />
          </div>
        ) : null}
      </div>
    );
  }

  if (question.type === "multi" && question.options) {
    const toggleOption = (option: string) => {
      const isSelected = arrayValue.includes(option);
      if (isSelected) {
        onChange({
          [question.id]: arrayValue.filter((item) => item !== option),
        });
        return;
      }

      if (
        question.maxSelections &&
        arrayValue.length >= question.maxSelections
      ) {
        return;
      }

      onChange({ [question.id]: [...arrayValue, option] });
    };

    return (
      <div
        className={cn(
          "grid gap-2",
          question.options.length > 6 ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-1"
        )}
      >
        {question.options.map((option) => (
          <OptionCard
            key={option}
            label={option}
            selected={arrayValue.includes(option)}
            onClick={() => toggleOption(option)}
          />
        ))}
      </div>
    );
  }

  return null;
}

interface OnboardingQuestionnaireProps {
  theme: ProfileEditTheme;
  profile: OnboardingProfile;
  onChange: (updates: Partial<OnboardingProfile>) => void;
  error?: string;
  pendingQuestionIds?: Set<string>;
}

export function OnboardingQuestionnaire({
  theme,
  profile,
  onChange,
  error,
  pendingQuestionIds,
}: OnboardingQuestionnaireProps) {
  return (
    <section className="mx-auto w-full max-w-lg">
      <div className="overflow-visible rounded-[28px] border border-[#1C1D1E]/[0.03] bg-white p-5 shadow-[0_24px_48px_-12px_rgba(28,29,30,0.08)] sm:p-6">
        <div className="space-y-6">
          {theme.questions.map((question) => {
            const isPending = pendingQuestionIds?.has(question.id) ?? false;

            return (
            <div
              key={question.id}
              id={`question-${question.id}`}
              className={cn(
                "space-y-2 rounded-[14px] transition-colors",
                isPending && "border border-[#2F9CFA]/25 bg-[#EBF5FF]/40 p-3"
              )}
            >
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <label htmlFor={question.id} className={labelClassName}>
                    {question.label}
                  </label>
                  {isPending ? (
                    <span className="rounded-full bg-[#2F9CFA]/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-[#2F9CFA]">
                      Not answered
                    </span>
                  ) : null}
                </div>
                {question.hint ? (
                  <p className="mt-1 text-[11px] font-medium text-[#1C1D1E]/45">
                    {question.hint}
                  </p>
                ) : null}
              </div>
              <QuestionField
                question={question}
                profile={profile}
                onChange={onChange}
              />
            </div>
            );
          })}
        </div>

        {error ? (
          <p className="mt-4 text-[11px] font-medium text-red-500">{error}</p>
        ) : null}
      </div>
    </section>
  );
}
