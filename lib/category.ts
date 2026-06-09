export const DEFAULT_CATEGORIES = [
  "reflection",
  "philosophy",
  "vulnerability",
  "curiosity",
  "growth",
  "connection",
  "wonder",
  "identity",
  "grief",
  "joy",
] as const;

export function normalizeCategory(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, " ");
}

export function getUniqueCategories(existing: string[]): string[] {
  const merged = new Set([
    ...DEFAULT_CATEGORIES,
    ...existing.map(normalizeCategory).filter(Boolean),
  ]);
  return Array.from(merged).sort();
}

export function filterCategorySuggestions(
  query: string,
  categories: string[]
): string[] {
  const normalized = normalizeCategory(query);
  if (!normalized) return categories.slice(0, 8);

  return categories
    .filter(
      (cat) =>
        cat.includes(normalized) ||
        cat.startsWith(normalized) ||
        normalized.startsWith(cat)
    )
    .slice(0, 8);
}

export function categoryExists(query: string, categories: string[]): boolean {
  const normalized = normalizeCategory(query);
  return categories.some((cat) => cat === normalized);
}
