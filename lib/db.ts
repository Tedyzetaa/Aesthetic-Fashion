import { supabaseAdmin } from "./supabase";
import { Post, PostInput, PostStatus } from "./types";
import { slugify } from "./slug";

// Camada de dados sobre a tabela "posts" no Supabase (Postgres).
// Ver supabase/migration.sql para o schema e as policies de RLS.

const TABLE = "posts";

type PostRow = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content_html: string | null;
  category: string | null;
  tags: string[] | null;
  cover_image: string | null;
  author: string | null;
  status: PostStatus;
  created_at: string;
  updated_at: string;
  published_at: string | null;
};

function fromRow(row: PostRow): Post {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    excerpt: row.excerpt || "",
    contentHtml: row.content_html || "",
    category: row.category || "Inspiração",
    tags: row.tags || [],
    coverImage: row.cover_image || "",
    author: row.author || "",
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    publishedAt: row.published_at
  };
}

function toRow(input: Partial<PostInput>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  if (input.title !== undefined) row.title = input.title;
  if (input.excerpt !== undefined) row.excerpt = input.excerpt;
  if (input.contentHtml !== undefined) row.content_html = input.contentHtml;
  if (input.category !== undefined) row.category = input.category;
  if (input.tags !== undefined) row.tags = input.tags;
  if (input.coverImage !== undefined) row.cover_image = input.coverImage;
  if (input.author !== undefined) row.author = input.author;
  if (input.status !== undefined) row.status = input.status;
  if (input.slug !== undefined) row.slug = input.slug;
  return row;
}

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const root = slugify(base) || "post";
  let candidate = root;
  let n = 2;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let query = supabaseAdmin.from(TABLE).select("id").eq("slug", candidate);
    if (ignoreId) query = query.neq("id", ignoreId);
    const { data, error } = await query.maybeSingle();
    if (error) throw new Error(`Erro ao validar slug: ${error.message}`);
    if (!data) return candidate;
    candidate = `${root}-${n}`;
    n += 1;
  }
}

export async function listPosts(opts?: {
  status?: PostStatus;
  category?: string;
}): Promise<Post[]> {
  let query = supabaseAdmin.from(TABLE).select("*");

  if (opts?.status) query = query.eq("status", opts.status);
  if (opts?.category) query = query.eq("category", opts.category);

  query = query.order("created_at", { ascending: false });

  const { data, error } = await query;
  if (error) throw new Error(`Erro ao listar posts: ${error.message}`);
  return (data as PostRow[]).map(fromRow);
}

export async function getPost(id: string): Promise<Post | undefined> {
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error) throw new Error(`Erro ao buscar post: ${error.message}`);
  return data ? fromRow(data as PostRow) : undefined;
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .select("*")
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw new Error(`Erro ao buscar post: ${error.message}`);
  return data ? fromRow(data as PostRow) : undefined;
}

export async function createPost(input: PostInput): Promise<Post> {
  const slug = await uniqueSlug(input.slug || input.title);
  const row = {
    ...toRow(input),
    slug,
    published_at: input.status === "published" ? new Date().toISOString() : null
  };
  const { data, error } = await supabaseAdmin.from(TABLE).insert(row).select("*").single();
  if (error) throw new Error(`Erro ao criar post: ${error.message}`);
  return fromRow(data as PostRow);
}

export async function updatePost(
  id: string,
  input: Partial<PostInput>
): Promise<Post | undefined> {
  const current = await getPost(id);
  if (!current) return undefined;

  const row = toRow(input);
  row.updated_at = new Date().toISOString();

  if (input.title !== undefined && input.title !== current.title && !input.slug) {
    row.slug = await uniqueSlug(input.title, id);
  }
  if (
    input.status === "published" &&
    current.status !== "published" &&
    !current.publishedAt
  ) {
    row.published_at = new Date().toISOString();
  }

  const { data, error } = await supabaseAdmin
    .from(TABLE)
    .update(row)
    .eq("id", id)
    .select("*")
    .maybeSingle();
  if (error) throw new Error(`Erro ao atualizar post: ${error.message}`);
  return data ? fromRow(data as PostRow) : undefined;
}

export async function deletePost(id: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin.from(TABLE).delete().eq("id", id).select("id");
  if (error) throw new Error(`Erro ao excluir post: ${error.message}`);
  return !!data && data.length > 0;
}

export async function getStats() {
  const items = await listPosts();
  return {
    total: items.length,
    publicados: items.filter((p) => p.status === "published").length,
    rascunhos: items.filter((p) => p.status === "draft").length,
    categorias: new Set(items.map((p) => p.category)).size
  };
}
