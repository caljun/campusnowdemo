export type PostType = "post" | "board" | "announcement";

export interface Post {
  id: string;
  type: PostType;
  displayName: string;
  text: string;
  createdAt: number;
  anonymous?: boolean;
  lat?: number;
  lng?: number;
  title?: string;
  replyCount?: number;
}
