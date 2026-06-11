export type ResponseStatus = "pending" | "accepted" | "declined";

export interface ResponseRow {
  id: string;
  post_id: string;
  responder_id: string;
  content: string;
  status: ResponseStatus;
  created_at: string;
}

export interface PrivateResponse {
  id: string;
  postId: string;
  postContent: string;
  content: string;
  createdAt: string;
}
