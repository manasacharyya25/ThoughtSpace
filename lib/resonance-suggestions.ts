import { normalizeCategory } from "@/lib/category";
import type { Post } from "@/types/post";

const RESONANCE_CLUSTERS: Record<string, readonly string[]> = {
  wonder: ["wonder", "philosophy", "curiosity", "reflection"],
  philosophy: ["philosophy", "wonder", "curiosity", "reflection"],
  curiosity: ["curiosity", "wonder", "philosophy", "reflection"],
  reflection: ["reflection", "wonder", "philosophy", "identity"],
  isolation: ["isolation", "melancholy", "grief", "vulnerability"],
  melancholy: ["melancholy", "isolation", "grief", "vulnerability"],
  grief: ["grief", "melancholy", "isolation", "vulnerability"],
  vulnerability: ["vulnerability", "grief", "melancholy", "isolation"],
  hope: ["hope", "joy", "growth", "wonder"],
  joy: ["joy", "hope", "growth", "connection"],
  growth: ["growth", "hope", "joy", "connection"],
  connection: ["connection", "growth", "identity", "joy"],
  identity: ["identity", "reflection", "vulnerability", "connection"],
};

export function getRelatedCategories(category: string): string[] {
  const normalized = normalizeCategory(category);
  const cluster = RESONANCE_CLUSTERS[normalized];
  if (cluster) return [...cluster];
  return [normalized];
}

export function findResonanceSuggestions(
  posts: Post[],
  castCategory: string,
  castPostId: string,
  userId: string,
  hasResponded: (postId: string) => boolean,
  limit = 3
): Post[] {
  const related = new Set(getRelatedCategories(castCategory));
  const castNormalized = normalizeCategory(castCategory);

  return posts
    .filter(
      (post) =>
        post.author_id !== userId &&
        post.id !== castPostId &&
        !hasResponded(post.id) &&
        related.has(normalizeCategory(post.category))
    )
    .sort((a, b) => {
      const aExact =
        normalizeCategory(a.category) === castNormalized ? 0 : 1;
      const bExact =
        normalizeCategory(b.category) === castNormalized ? 0 : 1;
      if (aExact !== bExact) return aExact - bExact;

      if (a.response_count !== b.response_count) {
        return a.response_count - b.response_count;
      }

      return (
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    })
    .slice(0, limit);
}
