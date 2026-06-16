export const WHISPER_FEED_TAGS = [
  "all",
  "wonder",
  "isolation",
  "melancholy",
] as const;

export type WhisperFeedTag = (typeof WHISPER_FEED_TAGS)[number];

export const WHISPER_COMPOSER_TAGS = [
  "#wonder",
  "#isolation",
  "#melancholy",
  "#hope",
] as const;
