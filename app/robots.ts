import type { MetadataRoute } from "next";
import { env } from "@/lib/env";

export default function robots(): MetadataRoute.Robots {
  const base = env.NEXT_PUBLIC_APP_URL;

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/about-us"],
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
