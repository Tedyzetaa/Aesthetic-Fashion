import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin, POSTS_BUCKET } from "@/lib/supabase";

// Recebe um arquivo via multipart/form-data (campo "file") e sobe para o
// bucket público "post-images" no Supabase Storage, retornando a URL
// pública para usar no post. Protegida no middleware.ts + isAuthorized
// (só admin autenticado consegue chegar aqui).

const TIPOS_PERMITIDOS = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const TAMANHO_MAXIMO = 8 * 1024 * 1024; // 8MB

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");
  const folder = (formData.get("folder") as string) || "content";

  if (!(file instanceof File)) {
    return NextResponse.json({ erro: "Nenhum arquivo enviado." }, { status: 400 });
  }

  if (!TIPOS_PERMITIDOS.includes(file.type)) {
    return NextResponse.json(
      { erro: "Formato inválido. Use JPG, PNG, WEBP ou GIF." },
      { status: 400 }
    );
  }

  if (file.size > TAMANHO_MAXIMO) {
    return NextResponse.json({ erro: "Arquivo muito grande. Limite de 8MB." }, { status: 400 });
  }

  const safeFolder = folder.replace(/[^a-zA-Z0-9_-]/g, "") || "content";
  const extensao = file.name.split(".").pop() || "jpg";
  const nomeArquivo = `${safeFolder}/${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 9)}.${extensao}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabaseAdmin.storage
    .from(POSTS_BUCKET)
    .upload(nomeArquivo, buffer, { contentType: file.type, upsert: false });

  if (error) {
    console.error(error);
    return NextResponse.json({ erro: "Não foi possível enviar a imagem." }, { status: 500 });
  }

  const { data: publicUrlData } = supabaseAdmin.storage
    .from(POSTS_BUCKET)
    .getPublicUrl(nomeArquivo);

  return NextResponse.json({ url: publicUrlData.publicUrl }, { status: 201 });
}
