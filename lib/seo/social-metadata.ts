import type { Metadata } from "next";
import { env } from "@/lib/env";

export const DEFAULT_OG_IMAGE = "/og/default.png";

type SocialMetadataOptions = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
  publishedTime?: string;
};

export function socialMetadata({
  title,
  description,
  path,
  type = "website",
  publishedTime,
}: SocialMetadataOptions): Metadata {
  const url = `${env.NEXT_PUBLIC_APP_URL}${path}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: env.NEXT_PUBLIC_APP_NAME,
      type,
      ...(publishedTime ? { publishedTime } : {}),
      images: [
        {
          url: DEFAULT_OG_IMAGE,
          width: 1024,
          height: 592,
          alt: env.NEXT_PUBLIC_APP_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [DEFAULT_OG_IMAGE],
    },
  };
}
