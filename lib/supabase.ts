import { createClient } from "@supabase/supabase-js";

// Cliente Supabase de uso EXCLUSIVO no servidor (rotas de API e server
// components). Usa a service role key, que ignora Row Level Security —
// por isso nunca deve ser importada em nenhum componente "use client"
// nem exposta ao navegador. O site nunca usa a anon key: todo acesso ao
// banco passa pela nossa própria API, então a tabela "posts" pode ficar
// totalmente bloqueada para anon/authenticated (ver supabase/migration.sql).

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error(
    "SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY precisam estar definidos (ver .env.example)."
  );
}

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { persistSession: false },
  global: {
    // Evita que o Next.js cacheie as respostas do Supabase (Data Cache),
    // que pode persistir entre deploys mesmo com `force-dynamic` na rota.
    fetch: (url, options = {}) => fetch(url, { ...options, cache: "no-store" })
  }
});

// Bucket público onde ficam as imagens enviadas pelo editor
// (capa, imagens do corpo do texto, galerias).
export const POSTS_BUCKET = "post-images";
