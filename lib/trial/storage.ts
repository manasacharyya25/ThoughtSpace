const STORAGE_KEY_PREFIX = "thoughtspace:trial-triggers";
const LEGACY_STORAGE_KEY = "thoughtspace:trial-triggers";

export type TrialTriggerKey = "firstCast" | "firstReply" | "inbox" | "profile";

export interface TrialTriggerState {
  firstCast: boolean;
  firstReply: boolean;
  inbox: boolean;
  profile: boolean;
}

const DEFAULT_STATE: TrialTriggerState = {
  firstCast: false,
  firstReply: false,
  inbox: false,
  profile: false,
};

function storageKey(userId: string): string {
  return `${STORAGE_KEY_PREFIX}:${userId}`;
}

function readState(userId: string): TrialTriggerState {
  if (typeof window === "undefined" || !userId) return DEFAULT_STATE;

  try {
    const raw = localStorage.getItem(storageKey(userId));
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<TrialTriggerState>;
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return DEFAULT_STATE;
  }
}

function writeState(userId: string, state: TrialTriggerState) {
  if (typeof window === "undefined" || !userId) return;
  localStorage.setItem(storageKey(userId), JSON.stringify(state));
}

/** Remove the old browser-wide key so new guests are not affected. */
export function clearLegacyTrialTriggerStorage() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LEGACY_STORAGE_KEY);
}

export function hasShownTrialTrigger(
  userId: string | undefined,
  key: TrialTriggerKey
): boolean {
  if (!userId) return false;
  return readState(userId)[key];
}

export function markTrialTriggerShown(
  userId: string | undefined,
  key: TrialTriggerKey
) {
  if (!userId) return;

  const state = readState(userId);
  if (state[key]) return;
  writeState(userId, { ...state, [key]: true });
}

function inboxChatGateKey(userId: string): string {
  return `thoughtspace:inbox-chat-gate:${userId}`;
}

export function setInboxChatGateFlag(userId: string | undefined) {
  if (typeof window === "undefined" || !userId) return;
  sessionStorage.setItem(inboxChatGateKey(userId), "1");
}

export function consumeInboxChatGateFlag(userId: string | undefined): boolean {
  if (typeof window === "undefined" || !userId) return false;

  const key = inboxChatGateKey(userId);
  const value = sessionStorage.getItem(key) === "1";
  if (value) sessionStorage.removeItem(key);
  return value;
}
