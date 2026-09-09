export type PostStatus = "draft" | "published";

export type Post = {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  category: string;
  tags: string[];
  coverImage: string;
  author: string;
  status: PostStatus;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
};

export type PostInput = {
  title: string;
  excerpt: string;
  contentHtml: string;
  category: string;
  tags: string[];
  coverImage: string;
  author: string;
  status: PostStatus;
  slug?: string;
};

export const CATEGORIES = ["Inspiração", "Estilo", "Atitude"] as const;
