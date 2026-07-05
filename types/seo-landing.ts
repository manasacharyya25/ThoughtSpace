import type {
  SeoFaqItem,
  SeoHowItWorksStep,
  SeoWhyChooseItem,
} from "@/data/seo-landing-shared";

export type ColourfulLandingCopy = {
  h1: string;
  h1Highlight?: string;
  subheading: string;
  cta: string;
  ctaHref?: string;
  trustLine?: string;
};

export type SeoLandingPage = {
  slug: string;
  keywordTitle: string;
  hero: ColourfulLandingCopy;
  whatIs: {
    paragraphs: string[];
  };
  whyChoose?: {
    title: string;
    items: SeoWhyChooseItem[];
  };
  howItWorks?: {
    title: string;
    steps: SeoHowItWorksStep[];
  };
  keyBenefits?: {
    title: string;
    items: readonly string[];
  };
  faq?: {
    title: string;
    items: SeoFaqItem[];
  };
  finalCta?: {
    title: string;
    lines: readonly string[];
    cta?: string;
  };
};

export type ResolvedSeoLandingPage = SeoLandingPage & {
  whatIsTitle: string;
  whyChoose: NonNullable<SeoLandingPage["whyChoose"]>;
  howItWorks: NonNullable<SeoLandingPage["howItWorks"]>;
  keyBenefits: {
    title: string;
    items: readonly string[];
  };
  faq: NonNullable<SeoLandingPage["faq"]>;
  finalCta: {
    title: string;
    lines: readonly string[];
    cta: string;
  };
};
