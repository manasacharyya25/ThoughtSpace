import type { CSSProperties } from "react";

/** Stagger delay for fade-in-up animations (40–80ms between items). */
export const STAGGER_MS = 50;

export function staggerStyle(index: number, ms = STAGGER_MS): CSSProperties {
  return { animationDelay: `${index * ms}ms` };
}
