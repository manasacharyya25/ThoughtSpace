export const AUTH_ERROR_MESSAGES = {
  auth: "Sign in failed. Please try again.",
  identity_already_exists:
    "This Google account is already registered. Use Continue with Google to sign in to that account.",
} as const;

export type AuthErrorCode = keyof typeof AUTH_ERROR_MESSAGES;

export function getAuthErrorMessage(code: string | null): string | undefined {
  if (!code) return undefined;
  if (code in AUTH_ERROR_MESSAGES) {
    return AUTH_ERROR_MESSAGES[code as AuthErrorCode];
  }
  return undefined;
}
