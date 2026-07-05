import Link from "next/link";
import { BrandLogo } from "@/components/brand/brand-logo";
import { LandingClouds } from "@/components/landing/landing-clouds";
import { LandingFooter } from "@/components/landing/landing-footer";
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
  mobileLayout = false,
}: {
  card: (typeof floatCards)[number];
  compact?: boolean;
  mobileLayout?: boolean;
}) {
  const metaSize = compact ? "text-[0.62rem]" : "text-[0.7rem]";

  return (
    <>
      {!mobileLayout && (
        <div
          className={`flex shrink-0 items-center justify-center rounded-full font-bold text-white ${card.avatarColor} ${
            compact ? "h-8 w-8 text-[0.65rem]" : "h-10 w-10 text-xs"
          }`}
        >
          {card.initials}
        </div>
      )}
      <div className="min-w-0">
        <p
          className={`font-normal leading-relaxed text-[#1C1D1E]/70 ${
            compact ? "text-[0.72rem]" : "text-[0.8rem]"
          }`}
        >
          &ldquo;{card.message}&rdquo;
        </p>
        {mobileLayout ? (
          <p
            className={`mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0 font-normal text-[#1C1D1E]/45 ${metaSize}`}
          >
            <span>{card.timeAgo}</span>
            <span className="text-[#1C1D1E]/25" aria-hidden="true">
              ·
            </span>
            <span className={`font-medium ${card.tagColor}`}>
              #{card.category}
            </span>
          </p>
        ) : (
          <>
            <p className={`mt-1.5 font-normal text-[#1C1D1E]/45 ${metaSize}`}>
              {card.timeAgo}
            </p>
            <p className={`mt-0.5 font-medium ${card.tagColor} ${metaSize}`}>
              #{card.category}
            </p>
          </>
        )}
      </div>
    </>
  );
}

function FloatCard({
  card,
  className,
  compact = false,
  mobileLayout = false,
}: {
  card: (typeof floatCards)[number];
  className?: string;
  compact?: boolean;
  mobileLayout?: boolean;
}) {
  return (
    <div
      className={`colourful-landing-float-card flex gap-2.5 rounded-[20px] border border-[#1C1D1E]/[0.03] bg-white text-left shadow-[0_24px_48px_-12px_rgba(28,29,30,0.08)] ${
        compact ? "gap-2 p-2.5" : "gap-2.5 p-3 sm:gap-3 sm:p-4"
      } ${className ?? ""}`}
    >
      <FloatCardContent
        card={card}
        compact={compact}
        mobileLayout={mobileLayout}
      />
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
        A thousand stories. {" "}<br />
        One <span className="relative inline-block text-[#2F9CFA] italic">
         human experience.
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
        {appName} is a community for curious minds exploring the thoughts, 
        emotions and questions that often go unspoken. Connect through 
        anonymous one-to-one conversations—free from profiles, followers 
        and the pressure to perform.
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
      href="/start"
      className={cn(
        "colourful-landing-btn-primary inline-flex items-center justify-center gap-3 rounded-[20px] border-none bg-[#1C1D1E] font-bold text-white no-underline shadow-[0_24px_48px_-12px_rgba(28,29,30,0.08)] hover:bg-[#2F9CFA] hover:shadow-[0_12px_32px_-4px_rgba(47,156,250,0.4)]",
        compact
          ? "gap-2 rounded-2xl px-6 py-3 text-xs"
          : "gap-3 rounded-[20px] px-[42px] py-5 text-[1.05rem]",
        fullWidth ? "w-full" : "min-[1100px]:w-auto"
      )}
    >
      <span>Join the Community</span>
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

function OneToOneOnlyBadge({
  className,
  inline = false,
}: {
  className?: string;
  inline?: boolean;
}) {
  return (
    <div
      className={cn(
        "colourful-landing-float-card colourful-landing-float-5s flex items-center gap-1.5 rounded-full border border-[#C5EAD0] bg-[#EBF7EE] px-3 py-2 text-[#1E6B37] shadow-[0_24px_48px_-12px_rgba(28,29,30,0.08)]",
        inline
          ? "relative shrink-0"
          : "pointer-events-none absolute z-[4]",
        className
      )}
    >
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
  );
}

export function ColourfulLanding() {
  const appName = env.NEXT_PUBLIC_APP_NAME;

  return (
    <div className="relative flex min-h-dvh flex-col overflow-hidden bg-[#FAF8F5] font-[family-name:var(--font-colourful-landing)] text-[#1C1D1E] antialiased">
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

      <LandingClouds />

      {/* Mobile layout — vertical stack, footer pinned to bottom */}
      <div className="relative z-10 flex min-h-dvh flex-col min-[1100px]:hidden">
        <header className="shrink-0 px-5 py-3">
          <BrandLogo />
        </header>

        <div className="flex min-h-0 flex-1 flex-col px-5 pb-3">
          <div className="flex min-h-0 flex-1 flex-col justify-evenly gap-3 py-2 sm:gap-4 sm:py-3">
            <FloatCard
              card={floatCards[0]}
              compact
              mobileLayout
              className="colourful-landing-float-8s w-fit max-w-[min(75%,280px)] self-end"
            />

            <div className="mx-auto w-full max-w-md shrink-0 text-center">
              <HeroCopy appName={appName} />
              <div className="mt-3 flex justify-center">
                <EarlyAccessBadge />
              </div>
            </div>

            <FloatCard
              card={floatCards[1]}
              compact
              mobileLayout
              className="colourful-landing-float-6s w-fit max-w-[min(75%,280px)] self-start"
            />

            <OneToOneOnlyBadge inline className="self-end" />

            <div className="mx-auto w-full max-w-sm shrink-0 space-y-3">
              <CtaButton fullWidth compact />
              <AnonymousTrustLine />
            </div>
          </div>

          <LandingFooter className="mt-0 shrink-0" />
        </div>
      </div>

      {/* Desktop layout */}
      <div className="relative hidden h-dvh flex-col overflow-hidden min-[1100px]:flex">
        <header className="relative z-10 mx-auto flex w-full max-w-[1200px] shrink-0 items-center justify-between px-8 py-3">
            <BrandLogo />
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

          <OneToOneOnlyBadge className="bottom-[16%] right-[5%] min-[1100px]:bottom-[18%] xl:bottom-[22%] xl:right-[15%]" />

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

          <div className="relative z-10 mx-auto w-full max-w-[1200px] shrink-0 px-8 xl:px-6">
            <LandingFooter />
          </div>
      </div>
    </div>
  );
}
