export interface User {
  name: string;
  permissions: Permission[];
}

export type Permission =
  | "VIEW_POSTS"
  | "VIEW_COMMENTS"
  | "EDIT_POST"
  | "CREATE_POST";

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

export interface CommentType {
  id: number;
  postId: number;
  name: string;
  email: string;
  body: string;
}

export interface NavigationItem {
  get: (_params?: Record<string, string | number>) => string;
  go: (_params?: Record<string, string | number>) => void;
}
