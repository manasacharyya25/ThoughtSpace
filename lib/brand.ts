import { env } from "@/lib/env";

/** Header wordmark: lowercase, no spaces, trailing period. */
export const BRAND_WORDMARK = `${env.NEXT_PUBLIC_APP_NAME.replace(/\s+/g, "").toLowerCase()}.`;
