const STORAGE_KEY = "thoughtspace:trial-triggers";

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

function readState(): TrialTriggerState {
  if (typeof window === "undefined") return DEFAULT_STATE;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    const parsed = JSON.parse(raw) as Partial<TrialTriggerState>;
    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return DEFAULT_STATE;
  }
}

function writeState(state: TrialTriggerState) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function hasShownTrialTrigger(key: TrialTriggerKey): boolean {
  return readState()[key];
}

export function markTrialTriggerShown(key: TrialTriggerKey) {
  const state = readState();
  if (state[key]) return;
  writeState({ ...state, [key]: true });
}

export const INBOX_CHAT_GATE_KEY = "thoughtspace:inbox-chat-gate";

export function setInboxChatGateFlag() {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(INBOX_CHAT_GATE_KEY, "1");
}

export function consumeInboxChatGateFlag(): boolean {
  if (typeof window === "undefined") return false;
  const value = sessionStorage.getItem(INBOX_CHAT_GATE_KEY) === "1";
  if (value) sessionStorage.removeItem(INBOX_CHAT_GATE_KEY);
  return value;
}
