export interface PostAuthorPreview {
  username: string;
  age_range: string;
  gender: string;
  gender_custom: string | null;
  country: string;
}

export type PostCategory = string;

export interface PostRow {
  id: string;
  author_id: string;
  content: string;
  category: string;
  created_at: string;
  response_count: number;
  author?: PostAuthorPreview | PostAuthorPreview[] | null;
}

export interface Post {
  id: string;
  author_id: string;
  content: string;
  category: PostCategory;
  timestamp: string;
  response_count: number;
  author?: PostAuthorPreview | null;
}
