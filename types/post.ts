export type PostCategory = string;

export interface Post {
  id: string;
  content: string;
  category: PostCategory;
  timestamp: string;
}
