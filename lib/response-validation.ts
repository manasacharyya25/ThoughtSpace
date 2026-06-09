import { countWords } from "./words";

export const RESPONSE_MIN_WORDS = 10;
export const RESPONSE_MAX_WORDS = 300;

export function validateResponse(content: string): string | undefined {
  const words = countWords(content);

  if (!content.trim()) {
    return "Write a response before sending.";
  }
  if (words < RESPONSE_MIN_WORDS) {
    return `Response must be at least ${RESPONSE_MIN_WORDS} words.`;
  }
  if (words > RESPONSE_MAX_WORDS) {
    return `Response must be under ${RESPONSE_MAX_WORDS} words.`;
  }
  return undefined;
}
