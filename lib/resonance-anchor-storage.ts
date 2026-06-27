const STORAGE_KEY = "thoughtspace:resonance-anchor";

export type ResonanceAnchor = {
  userId: string;
  postId: string;
  category: string;
  castAt: string;
};

export function loadResonanceAnchor(): ResonanceAnchor | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as ResonanceAnchor;
    if (
      !parsed.userId ||
      !parsed.postId ||
      !parsed.category ||
      !parsed.castAt
    ) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}

export function saveResonanceAnchor(anchor: ResonanceAnchor): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(anchor));
}

export function clearResonanceAnchor(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}
