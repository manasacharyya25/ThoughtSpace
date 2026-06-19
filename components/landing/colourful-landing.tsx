import Link from "next/link";
import { env } from "@/lib/env";
import { cn } from "@/lib/utils";
import "./colourful-landing.css";

const desktopFloatCardStyles = [
  "top-[45%] xl:left-[10%] xl:top-[12%]",
  "top-[50%] xl:right-[15%] xl:top-[22%]",
  "bottom-[12%] xl:bottom-[16%] xl:left-[13%]",
] as const;

const floatCards = [
  {
    initials: "LK",
    avatarColor: "bg-[#2F9CFA]",
    tagColor: "text-[#2F9CFA]",
    message: "I feel disconnected even in crowded rooms",
    timeAgo: "12 minutes ago",
    category: "longing",
  },
  {
    initials: "MR",
    avatarColor: "bg-[#FFAB91]",
    tagColor: "text-[#E07A5F]",
    message: "I miss having deep conversations",
    timeAgo: "28 minutes ago",
    category: "wonder",
  },
  {
    initials: "JP",
    avatarColor: "bg-[#B39DDB]",
    tagColor: "text-[#8E7CC3]",
    message: "Success feels emptier than I expected",
    timeAgo: "1 hour ago",
    category: "reflection",
  },
] as const;

function FloatCardContent({
  card,
  compact = false,
}: {
  card: (typeof floatCards)[number];
  compact?: boolean;
}) {
  return (
    <>
      <div
        className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${card.avatarColor} ${
          compact ? "h-8 w-8 text-[0.65rem]" : "h-10 w-10 text-xs"
        }`}
      >
        {card.initials}
      </div>
      <div className="min-w-0">
        <p
          className={`font-normal leading-relaxed text-[#1C1D1E]/70 ${
            compact ? "text-[0.72rem]" : "text-[0.8rem]"
          }`}
        >
          &ldquo;{card.message}&rdquo;
        </p>
        <p
          className={`mt-1.5 font-normal text-[#1C1D1E]/45 ${
            compact ? "text-[0.62rem]" : "text-[0.7rem]"
          }`}
        >
          {card.timeAgo}
        </p>
        <p
          className={`mt-0.5 font-medium ${card.tagColor} ${
            compact ? "text-[0.62rem]" : "text-[0.7rem]"
          }`}
        >
          #{card.category}
        </p>
      </div>
    </>
  );
}

function FloatCard({
  card,
  className,
  compact = false,
}: {
  card: (typeof floatCards)[number];
  className?: string;
  compact?: boolean;
}) {
  return (
    <div
      className={`colourful-landing-float-card flex gap-2.5 rounded-[20px] border border-[#1C1D1E]/[0.03] bg-white text-left shadow-[0_24px_48px_-12px_rgba(28,29,30,0.08)] ${
        compact ? "gap-2 p-2.5" : "gap-2.5 p-3 sm:gap-3 sm:p-4"
      } ${className ?? ""}`}
    >
      <FloatCardContent card={card} compact={compact} />
    </div>
  );
}

function AnonymousTrustLine() {
  return (
    <div className="flex items-center justify-center gap-1.5 text-[0.55rem] font-bold uppercase tracking-[0.8px] text-[#1C1D1E]/40 sm:text-[0.58rem]">
      <svg
        width="11"
        height="11"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#81C784"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
      <span>Anonymous · 1-to-1 · No profile pressure</span>
    </div>
  );
}

function HeroCopy({
  appName,
  variant = "mobile",
}: {
  appName: string;
  variant?: "mobile" | "desktop";
}) {
  const isDesktop = variant === "desktop";

  return (
    <>
      <h1
        className={cn(
          "mx-auto font-extrabold leading-[1.08] tracking-[-2px] text-[#1C1D1E]",
          isDesktop
            ? "max-w-[540px] text-[clamp(1.5rem,3vw,2.44rem)]"
            : "max-w-[800px] text-[clamp(1.5rem,5.5vw,2.75rem)]"
        )}
      >
        No profiles. No followers.{" "}
        <span className="relative inline-block text-[#2F9CFA]">
          Just real dialogue.
        </span>
      </h1>

      <p
        className={cn(
          "mx-auto font-medium leading-relaxed text-[#1C1D1E]/65",
          isDesktop
            ? "mt-[0.6em] max-w-[405px] text-[clamp(0.7rem,1.35vw,0.79rem)]"
            : "mt-2 max-w-[620px] text-[clamp(0.8rem,2.2vw,1rem)]"
        )}
      >
        {appName} strips away the performance of modern social media. We connect
        you 1-to-1 with other anonymous minds, based entirely on the questions
        you ask, the feelings you carry, and the ways you wonder.
      </p>
    </>
  );
}

function CtaButton({
  fullWidth = false,
  compact = false,
}: {
  fullWidth?: boolean;
  compact?: boolean;
}) {
  return (
    <Link
      href="/login"
      className={cn(
        "colourful-landing-btn-primary inline-flex items-center justify-center gap-3 rounded-[20px] border-none bg-[#1C1D1E] font-bold text-white no-underline shadow-[0_24px_48px_-12px_rgba(28,29,30,0.08)] hover:bg-[#2F9CFA] hover:shadow-[0_12px_32px_-4px_rgba(47,156,250,0.4)]",
        compact
          ? "gap-2 rounded-2xl px-6 py-3 text-xs"
          : "gap-3 rounded-[20px] px-[42px] py-5 text-[1.05rem]",
        fullWidth ? "w-full" : "min-[1100px]:w-auto"
      )}
    >
      <span>Get Started</span>
      <svg
        className="colourful-landing-btn-arrow"
        width={compact ? 14 : 18}
        height={compact ? 14 : 18}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    </Link>
  );
}

function EarlyAccessBadge() {
  return (
    <div className="flex items-center gap-2 rounded-full border border-[#1C1D1E]/5 bg-white px-4 py-2 text-xs font-bold uppercase tracking-wider shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
      <span
        className="colourful-landing-rocket-pop inline-block leading-none"
        aria-hidden="true"
      >
        🚀
      </span>
      <span>Early access community</span>
    </div>
  );
}

function BrandLogo({ brandLabel }: { brandLabel: string }) {
  return (
    <Link
      href="/"
      className="colourful-landing-brand inline-flex items-center gap-3 no-underline"
    >
      <div className="colourful-landing-brand-logo flex h-[38px] w-[38px] items-center justify-center rounded-xl bg-[#1C1D1E] text-white transition-[background-color] duration-300">
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
        </svg>
      </div>
      <div className="text-xl font-extrabold tracking-[-0.5px] text-[#1C1D1E]">
        {brandLabel}.
      </div>
    </Link>
  );
}

export function ColourfulLanding() {
  const appName = env.NEXT_PUBLIC_APP_NAME;
  const brandLabel = appName.toLowerCase();

  return (
    <div className="relative flex min-h-dvh flex-col overflow-x-hidden bg-[#FAF8F5] font-[family-name:var(--font-colourful-landing)] text-[#1C1D1E] antialiased">
      <div
        className="pointer-events-none absolute -left-[20vw] -top-[20vw] z-[1] h-[50vw] w-[50vw] rounded-full bg-[#2F9CFA] opacity-65 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -bottom-[15vw] -right-[15vw] z-[1] h-[45vw] w-[45vw] rounded-full bg-[#FFAB91] opacity-65 blur-[100px]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/4 z-[1] h-[35vw] w-[35vw] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B39DDB] opacity-30 blur-[100px]"
        aria-hidden="true"
      />

      {/* Mobile layout — matches wireframe */}
      <div className="relative z-10 flex h-dvh flex-col overflow-hidden min-[1100px]:hidden">
        <header className="shrink-0 px-5 py-3">
          <BrandLogo brandLabel={brandLabel} />
        </header>

        <div className="relative flex min-h-0 flex-1 flex-col px-5 pb-3">
          <div className="relative flex min-h-0 flex-1 flex-col justify-evenly">
            <FloatCard
              card={floatCards[0]}
              compact
              className="colourful-landing-float-8s absolute right-0 top-0 z-[4] max-w-[58%]"
            />

            <div className="relative z-[5] mx-auto w-full max-w-md text-center">
              <HeroCopy appName={appName} />
            </div>

            <FloatCard
              card={floatCards[1]}
              compact
              className="colourful-landing-float-6s relative z-[4] max-w-[68%] self-start"
            />
          </div>

          <div className="relative z-[5] mx-auto w-full max-w-sm shrink-0 space-y-3 pt-2">
            <CtaButton fullWidth compact />
            <AnonymousTrustLine />
          </div>
        </div>
      </div>

      {/* Desktop layout */}
      <div className="relative hidden h-dvh flex-col overflow-hidden min-[1100px]:flex">
        <header className="relative z-10 mx-auto flex w-full max-w-[1200px] shrink-0 items-center justify-between px-8 py-3">
            <BrandLogo brandLabel={brandLabel} />
            <EarlyAccessBadge />
          </header>

          {floatCards.map((card, index) => (
            <FloatCard
              key={`desktop-${card.message}`}
              card={card}
              compact
              className={`colourful-landing-float-card pointer-events-none absolute z-[4] hidden max-w-[165px] xl:flex xl:max-w-[198px] ${desktopFloatCardStyles[index]} ${
                index === 0
                  ? "colourful-landing-float-6s"
                  : index === 1
                    ? "colourful-landing-float-8s"
                    : "colourful-landing-float-7s"
              }`}
            />
          ))}

          <div className="colourful-landing-float-card colourful-landing-float-5s pointer-events-none absolute bottom-[18%] z-[4] hidden items-center gap-1.5 rounded-full border border-[#C5EAD0] bg-[#EBF7EE] px-3 py-2 text-[#1E6B37] shadow-[0_24px_48px_-12px_rgba(28,29,30,0.08)] xl:right-[15%] xl:flex xl:bottom-[22%]">
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
            <span className="text-[0.6rem] font-extrabold tracking-[0.5px]">
              1-TO-1 ONLY
            </span>
          </div>

          <main className="relative z-10 mx-auto flex w-full max-w-[900px] min-h-0 flex-1 flex-col items-center justify-evenly px-8 py-[clamp(0.5rem,2dvh,1.25rem)] text-center xl:px-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#1C1D1E]/[0.04] bg-white px-5 py-2.5 text-[0.7rem] font-extrabold uppercase tracking-[1.5px] text-[#1C1D1E] shadow-[0_4px_12px_rgba(0,0,0,0.02)]">
              <span className="text-[#2F9CFA]">✦</span>
              A New Way to Connect
              <span className="text-[#2F9CFA]">✦</span>
            </div>

            <HeroCopy appName={appName} variant="desktop" />

            <div className="flex flex-col items-center gap-[clamp(0.5rem,1.5dvh,1rem)]">
              <CtaButton compact />
              <AnonymousTrustLine />
            </div>
          </main>
      </div>
    </div>
  );
}
