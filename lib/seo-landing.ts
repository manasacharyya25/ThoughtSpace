import { SEO_LANDING_SHARED } from "@/data/seo-landing-shared";
import {
  SEO_LANDING_PAGES,
  SEO_LANDING_PAGES_BY_SLUG,
  SEO_LANDING_SLUGS,
} from "@/data/seo-landing-pages";
import type {
  ResolvedSeoLandingPage,
  SeoLandingPage,
} from "@/types/seo-landing";

const RESERVED_SLUGS = new Set([
  "about-us",
  "api",
  "chat",
  "colourful-landing",
  "feed",
  "inbox",
  "login",
  "onboarding",
  "privacy-policy",
  "profile",
  "terms-of-service",
  "test",
]);

const SEO_SLUG_SET = new Set(SEO_LANDING_SLUGS);

export function isSeoLandingPath(pathname: string): boolean {
  const slug = pathname.startsWith("/") ? pathname.slice(1) : pathname;
  if (!slug || slug.includes("/")) return false;
  return SEO_SLUG_SET.has(slug);
}

export function getSeoLandingSlugs(): string[] {
  return SEO_LANDING_SLUGS;
}

export function getSeoLandingPage(slug: string): SeoLandingPage | undefined {
  if (RESERVED_SLUGS.has(slug)) return undefined;
  return SEO_LANDING_PAGES_BY_SLUG[slug];
}

export function resolveSeoLandingPage(page: SeoLandingPage): ResolvedSeoLandingPage {
  return {
    ...page,
    whatIsTitle: `What is ${page.keywordTitle}?`,
    whyChoose: page.whyChoose ?? SEO_LANDING_SHARED.whyChoose,
    howItWorks: page.howItWorks ?? SEO_LANDING_SHARED.howItWorks,
    keyBenefits: page.keyBenefits ?? SEO_LANDING_SHARED.keyBenefits,
    faq: page.faq ?? SEO_LANDING_SHARED.faq,
    finalCta: {
      ...SEO_LANDING_SHARED.finalCta,
      ...page.finalCta,
      cta: page.finalCta?.cta ?? page.hero.cta,
    },
  };
}

export function getAllResolvedSeoLandingPages(): ResolvedSeoLandingPage[] {
  return SEO_LANDING_PAGES.map(resolveSeoLandingPage);
}

export function buildFaqJsonLd(faq: ResolvedSeoLandingPage["faq"]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
