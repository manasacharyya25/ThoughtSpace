import { DEFAULT_HOME_COPY } from "@/data/seo-landing-pages";
import { ColourfulLandingHero } from "@/components/landing/colourful-landing-hero";

export function ColourfulLanding() {
  return <ColourfulLandingHero copy={DEFAULT_HOME_COPY} />;
}
