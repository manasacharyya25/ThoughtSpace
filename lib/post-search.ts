import { normalizeCategory } from "@/lib/category";

export function tokenizeSearchQuery(query: string): string[] {
  return query.trim().toLowerCase().split(/\s+/).filter(Boolean);
}

function tokenMatchesTag(token: string, category: string): boolean {
  const tag = normalizeCategory(token.slice(1));
  if (!tag) return true;
  return category === tag || category.includes(tag);
}

function tokenMatchesWord(token: string, content: string, category: string): boolean {
  return content.includes(token) || category.includes(token);
}

export function postMatchesSearch(
  content: string,
  category: string,
  query: string
): boolean {
  const tokens = tokenizeSearchQuery(query);
  if (tokens.length === 0) return true;

  const normalizedContent = content.toLowerCase();
  const normalizedCategory = normalizeCategory(category);

  return tokens.every((token) => {
    if (token.startsWith("#")) {
      return tokenMatchesTag(token, normalizedCategory);
    }
    return tokenMatchesWord(token, normalizedContent, normalizedCategory);
  });
}
