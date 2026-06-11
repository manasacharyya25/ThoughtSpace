export type PostCategory = string;

export interface PostRow {
  id: string;
  author_id: string;
  content: string;
  category: string;
  created_at: string;
  response_count: number;
}

export interface Post {
  id: string;
  author_id: string;
  content: string;
  category: PostCategory;
  timestamp: string;
  response_count: number;
}
