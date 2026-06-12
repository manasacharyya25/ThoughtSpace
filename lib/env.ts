function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const env = {
  NEXT_PUBLIC_APP_URL: getEnv(
    "NEXT_PUBLIC_APP_URL",
    "http://localhost:3000"
  ),
  NEXT_PUBLIC_APP_NAME: getEnv("NEXT_PUBLIC_APP_NAME", "ThoughtSpace"),
  API_SECRET_KEY: process.env.API_SECRET_KEY,
} as const;
