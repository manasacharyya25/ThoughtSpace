let audioContext: AudioContext | null = null;

const SOUNDS_ENABLED_KEY = "spaces:soundsEnabled";

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    audioContext = new AudioContext();
  }
  return audioContext;
}

export function unlockNotificationSound() {
  const ctx = getAudioContext();
  if (ctx?.state === "suspended") {
    void ctx.resume();
  }
}

function isSoundEnabled() {
  if (typeof window === "undefined") return false;
  const stored = localStorage.getItem(SOUNDS_ENABLED_KEY);
  return stored !== "false";
}

function playTone(frequency: number, startTime: number, duration: number) {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();

  oscillator.type = "sine";
  oscillator.frequency.value = frequency;
  gain.gain.setValueAtTime(0.0001, startTime);
  gain.gain.exponentialRampToValueAtTime(0.08, startTime + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

  oscillator.connect(gain);
  gain.connect(ctx.destination);
  oscillator.start(startTime);
  oscillator.stop(startTime + duration);
}

export function playMessageNotification() {
  if (!isSoundEnabled()) return;

  unlockNotificationSound();
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  playTone(523.25, now, 0.12);
  playTone(659.25, now + 0.1, 0.14);
}

export function playPendingNotification() {
  if (!isSoundEnabled()) return;

  unlockNotificationSound();
  const ctx = getAudioContext();
  if (!ctx) return;

  const now = ctx.currentTime;
  playTone(440, now, 0.1);
  playTone(554.37, now + 0.08, 0.12);
}
