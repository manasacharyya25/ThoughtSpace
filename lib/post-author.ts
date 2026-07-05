import type { Profile } from "@/types/profile";
import type { Post, PostAuthorPreview } from "@/types/post";

export function postAuthorFromProfile(profile: Profile): PostAuthorPreview {
  return {
    username: profile.username,
    age_range: profile.age_range,
    gender: profile.gender,
    gender_custom: profile.gender_custom,
    country: profile.country,
  };
}

export function resolvePostAuthor(
  post: Post,
  ownProfile: Profile | null | undefined
): PostAuthorPreview | null {
  if (post.author) return post.author;
  if (ownProfile && post.author_id === ownProfile.id) {
    return postAuthorFromProfile(ownProfile);
  }
  return null;
}

export function getPostAvatarSeed(
  post: Post,
  author?: PostAuthorPreview | null
): string {
  return author?.username ?? post.author_id;
}
