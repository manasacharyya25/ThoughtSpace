import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { notFound } from "next/navigation";
import { ColourfulLandingHero } from "@/components/landing/colourful-landing-hero";
import { LandingFooter } from "@/components/landing/landing-footer";
import { SeoLandingSections } from "@/components/landing/seo/seo-landing-sections";
import "@/components/landing/colourful-landing.css";
import { env } from "@/lib/env";
import {
  buildFaqJsonLd,
  getSeoLandingPage,
  getSeoLandingSlugs,
  resolveSeoLandingPage,
} from "@/lib/seo-landing";

const colourfulLandingSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-colourful-landing",
});

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getSeoLandingSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const page = getSeoLandingPage(slug);
  if (!page) return {};

  const url = `${env.NEXT_PUBLIC_APP_URL}/${slug}`;

  return {
    title: page.hero.h1,
    description: page.hero.subheading,
    alternates: { canonical: url },
    openGraph: {
      title: page.hero.h1,
      description: page.hero.subheading,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page.hero.h1,
      description: page.hero.subheading,
    },
  };
}

export default async function SeoLandingPage({ params }: PageProps) {
  const { slug } = await params;
  const page = getSeoLandingPage(slug);
  if (!page) notFound();

  const resolved = resolveSeoLandingPage(page);
  const faqJsonLd = buildFaqJsonLd(resolved.faq);

  return (
    <div className={colourfulLandingSans.variable}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <ColourfulLandingHero
        copy={page.hero}
        showFooter={false}
        scrollable
      />
      <SeoLandingSections page={resolved} />
      <div className="relative z-10 bg-[#FAF8F5] px-5 pb-[max(1.25rem,env(safe-area-inset-bottom))] font-[family-name:var(--font-colourful-landing)] sm:px-8">
        <div className="mx-auto max-w-[1200px]">
          <LandingFooter />
        </div>
      </div>
    </div>
  );
}
