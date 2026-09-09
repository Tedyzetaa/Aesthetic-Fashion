-- ============================================================
-- Aesthetic Fashion — configuração do Supabase
-- Rode este script inteiro em: Supabase Dashboard > SQL Editor
-- ============================================================

create extension if not exists pgcrypto;

-- 1) Tabela de posts -------------------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  excerpt text,
  content_html text,
  category text,
  tags text[] default '{}',
  cover_image text,
  status text not null default 'draft' check (status in ('draft','published')),
  author text,
  created_at timestamptz not null default now()
);

alter table public.posts enable row level security;

-- Qualquer visitante pode ler posts publicados
create policy "Public can view published posts"
on public.posts for select
to anon
using (status = 'published');

-- Usuários autenticados (admin) podem ler tudo, inclusive rascunhos
create policy "Authenticated can view all posts"
on public.posts for select
to authenticated
using (true);

-- Usuários autenticados podem criar, editar e excluir posts
create policy "Authenticated can insert posts"
on public.posts for insert
to authenticated
with check (true);

create policy "Authenticated can update posts"
on public.posts for update
to authenticated
using (true);

create policy "Authenticated can delete posts"
on public.posts for delete
to authenticated
using (true);

-- 2) Bucket de imagens -------------------------------------------------
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

create policy "Public read post images"
on storage.objects for select
to public
using (bucket_id = 'post-images');

create policy "Authenticated upload post images"
on storage.objects for insert
to authenticated
with check (bucket_id = 'post-images');

create policy "Authenticated update post images"
on storage.objects for update
to authenticated
using (bucket_id = 'post-images');

create policy "Authenticated delete post images"
on storage.objects for delete
to authenticated
using (bucket_id = 'post-images');

-- ============================================================
-- Depois de rodar este script:
-- 1. Vá em Authentication > Users > Add user e crie o e-mail/senha
--    que você (admin) vai usar para logar no painel /admin.
-- 2. Vá em Project Settings > API e copie a "Project URL" e a
--    chave "anon public".
-- 3. Cole essas duas informações no topo do arquivo HTML do site,
--    nas constantes SUPABASE_URL e SUPABASE_ANON_KEY.
-- ============================================================
