import { NextRequest, NextResponse } from "next/server";
import { listPosts, createPost } from "@/lib/db";
import { isAuthorized } from "@/lib/auth";
import { PostInput } from "@/lib/types";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("categoria") || undefined;
  const admin = searchParams.get("admin") === "1";

  try {
    const items = await listPosts({
      category,
      status: admin && isAuthorized(req) ? undefined : "published"
    });
    return NextResponse.json({ items });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ erro: "Não foi possível carregar os posts." }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as PostInput;

  if (!body.title || !body.title.trim()) {
    return NextResponse.json({ erro: "Dê um título ao post." }, { status: 400 });
  }
  if (!body.author || !body.author.trim()) {
    return NextResponse.json({ erro: "Informe o nome do autor." }, { status: 400 });
  }

  try {
    const post = await createPost({
      title: body.title,
      excerpt: body.excerpt || "",
      contentHtml: body.contentHtml || "",
      category: body.category || "Inspiração",
      tags: body.tags || [],
      coverImage: body.coverImage || "",
      author: body.author,
      status: body.status === "published" ? "published" : "draft"
    });
    return NextResponse.json({ item: post }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ erro: "Não foi possível salvar o post." }, { status: 500 });
  }
}
