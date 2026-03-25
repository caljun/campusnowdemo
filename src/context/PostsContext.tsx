import { createContext, useContext, useState, type ReactNode } from "react";
import type { Post } from "../types";

interface PostsContextType {
  posts: Post[];
  addPost: (post: Omit<Post, "id">) => void;
}

const PostsContext = createContext<PostsContextType | null>(null);

export function PostsProvider({ children }: { children: ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);

  const addPost = (post: Omit<Post, "id">) => {
    const newPost: Post = { ...post, id: crypto.randomUUID() };
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <PostsContext.Provider value={{ posts, addPost }}>
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const ctx = useContext(PostsContext);
  if (!ctx) throw new Error("usePosts must be used within PostsProvider");
  return ctx;
}
