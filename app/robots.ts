import type { MetadataRoute } from "next";
import { getSeoLandingSlugs } from "@/lib/seo-landing";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const base = env.NEXT_PUBLIC_APP_URL;
  const seoPaths = getSeoLandingSlugs().map((slug) => `/${slug}`);

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/about-us", ...seoPaths],
      disallow: [
        "/api/",
        "/feed",
        "/inbox",
        "/profile",
        "/chat",
        "/onboarding",
        "/login",
        "/test",
        "/colourful-landing",
      ],
    },
    sitemap: `${base}/sitemap.xml`,
  };
}
