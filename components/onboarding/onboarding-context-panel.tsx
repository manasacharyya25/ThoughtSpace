import type { OnboardingIllustrationId } from "@/types/onboarding-profile";
import type { ProfileEditTheme } from "@/types/onboarding-profile";

function ThemeIllustration({ themeId }: { themeId: OnboardingIllustrationId }) {
  const common =
    "mx-auto flex h-36 w-36 items-center justify-center rounded-full bg-[#2F9CFA]/8";

  switch (themeId) {
    case "basics":
      return (
        <div className={common} aria-hidden="true">
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            <path
              d="M36 58V28"
              stroke="#2F9CFA"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <path
              d="M28 36c0-8 4-14 8-14s8 6 8 14"
              stroke="#81C784"
              strokeWidth="3"
              strokeLinecap="round"
            />
            <ellipse cx="36" cy="58" rx="8" ry="3" fill="#FFAB91" opacity="0.5" />
          </svg>
        </div>
      );
    case "identity":
      return (
        <div className={common} aria-hidden="true">
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            <circle cx="36" cy="26" r="10" stroke="#2F9CFA" strokeWidth="2.5" />
            <path
              d="M20 54c2-10 8-14 16-14s14 4 16 14"
              stroke="#FFAB91"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              d="M48 42c6 2 10 6 12 12"
              stroke="#81C784"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="54" cy="38" r="4" fill="#B39DDB" opacity="0.6" />
          </svg>
        </div>
      );
    case "values-interests":
    case "values":
      return (
        <div className={common} aria-hidden="true">
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            <path
              d="M36 58c-8-6-14-14-14-22a14 14 0 1 1 28 0c0 8-6 16-14 22Z"
              stroke="#FFAB91"
              strokeWidth="3"
            />
            <path
              d="M36 46V34"
              stroke="#2F9CFA"
              strokeWidth="3"
              strokeLinecap="round"
            />
          </svg>
        </div>
      );
    case "interests":
      return (
        <div className={common} aria-hidden="true">
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            <path
              d="M36 18l4 10 10 2-7 7 2 10-9-5-9 5 2-10-7-7 10-2 4-10Z"
              stroke="#B39DDB"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    case "connect":
      return (
        <div className={common} aria-hidden="true">
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            <circle cx="24" cy="30" r="10" stroke="#2F9CFA" strokeWidth="2.5" />
            <circle cx="48" cy="30" r="10" stroke="#FFAB91" strokeWidth="2.5" />
            <path
              d="M18 48c4-6 10-8 18-8s14 2 18 8"
              stroke="#81C784"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      );
    case "connections":
    case "looking-for":
      return (
        <div className={common} aria-hidden="true">
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            <circle cx="36" cy="36" r="18" stroke="#2F9CFA" strokeWidth="2.5" />
            <circle cx="36" cy="36" r="8" stroke="#FFAB91" strokeWidth="2.5" />
            <path d="M36 18v8M36 46v8M18 36h8M46 36h8" stroke="#B39DDB" strokeWidth="2" />
          </svg>
        </div>
      );
    case "conversation-style":
      return (
        <div className={common} aria-hidden="true">
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            <circle cx="24" cy="30" r="10" stroke="#2F9CFA" strokeWidth="2.5" />
            <circle cx="48" cy="30" r="10" stroke="#FFAB91" strokeWidth="2.5" />
            <path
              d="M18 48c4-6 10-8 18-8s14 2 18 8"
              stroke="#81C784"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
        </div>
      );
    case "privacy":
      return (
        <div className={common} aria-hidden="true">
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            <rect
              x="22"
              y="30"
              width="28"
              height="22"
              rx="4"
              stroke="#2F9CFA"
              strokeWidth="2.5"
            />
            <path
              d="M30 30V26a6 6 0 0 1 12 0v4"
              stroke="#2F9CFA"
              strokeWidth="2.5"
            />
          </svg>
        </div>
      );
    case "extras":
    default:
      return (
        <div className={common} aria-hidden="true">
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            <path
              d="M36 16v40M20 36h32"
              stroke="#81C784"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <circle cx="36" cy="36" r="18" stroke="#B39DDB" strokeWidth="2" />
          </svg>
        </div>
      );
  }
}

interface OnboardingContextPanelProps {
  theme: ProfileEditTheme;
}

export function OnboardingContextPanel({ theme }: OnboardingContextPanelProps) {
  return (
    <section className="flex w-full max-w-md flex-col justify-center">
      <p className="mb-3 inline-flex w-fit items-center gap-2 rounded-full border border-[#1C1D1E]/[0.04] bg-white px-4 py-1.5 text-[0.65rem] font-extrabold uppercase tracking-[1.5px] text-[#1C1D1E] shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
        <span className="text-[#2F9CFA]">✦</span>
        {theme.title}
        <span className="text-[#2F9CFA]">✦</span>
      </p>

      <h1 className="text-[clamp(1.5rem,3vw,2.2rem)] font-extrabold leading-[1.08] tracking-[-1px] text-[#1C1D1E]">
        {theme.subtitle}
      </h1>

      <div className="mt-5 rounded-[20px] border border-[#1C1D1E]/[0.06] bg-white/70 p-4 shadow-[0_12px_32px_-12px_rgba(28,29,30,0.08)]">
        <p className="text-[0.65rem] font-extrabold uppercase tracking-[1.2px] text-[#2F9CFA]">
          Why we ask
        </p>
        <p className="mt-2 text-[clamp(0.7rem,1.35vw,0.79rem)] font-medium leading-relaxed text-[#1C1D1E]/65">
          {theme.whyWeAsk}
        </p>
      </div>

      <div className="mt-8 hidden lg:block">
        <ThemeIllustration themeId={theme.illustration} />
      </div>
    </section>
  );
}
