-- ============================================================
-- Aesthetic Fashion — schema do Supabase
-- Rode este script inteiro em: Supabase Dashboard > SQL Editor
--
-- Modelo de segurança: o site NUNCA usa a "anon key" no navegador.
-- Toda leitura e escrita passa pela nossa própria API (Next.js, rodando
-- no servidor com a "service role key", que ignora RLS). Por isso a
-- tabela fica com RLS ativado e SEM nenhuma policy — ou seja, bloqueada
-- por padrão para anon/authenticated. Só a service role (o nosso
-- backend) consegue ler ou escrever nela.
-- ============================================================

create extension if not exists pgcrypto;

-- 1) Tabela de posts -------------------------------------------------
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  excerpt text,
  content_html text,
  category text not null default 'Inspiração',
  tags text[] default '{}',
  cover_image text,
  author text,
  status text not null default 'draft' check (status in ('draft', 'published')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create index if not exists posts_status_created_idx on public.posts (status, created_at desc);
create index if not exists posts_slug_idx on public.posts (slug);

alter table public.posts enable row level security;
-- Nenhuma policy criada de propósito: acesso só via service role.

-- 2) Bucket de imagens -------------------------------------------------
-- Bucket público: as imagens dos posts precisam carregar direto no
-- navegador dos visitantes, sem autenticação. Uploads continuam restritos
-- porque só a service role (usada pela nossa API /api/upload) grava nele.
insert into storage.buckets (id, name, public)
values ('post-images', 'post-images', true)
on conflict (id) do nothing;

-- ============================================================
-- Depois de rodar este script:
-- 1. Vá em Project Settings > API e copie a "Project URL" e a
--    "service_role key" (NUNCA a anon key — não é usada aqui).
-- 2. Gere o hash da sua senha de admin localmente:
--    node -e "console.log(require('bcryptjs').hashSync('SUA_SENHA', 10))"
-- 3. Preencha o .env / as variáveis de ambiente na Vercel com:
--    SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, ADMIN_EMAIL,
--    ADMIN_PASSWORD_HASH, ADMIN_JWT_SECRET (uma string aleatória longa).
-- ============================================================
