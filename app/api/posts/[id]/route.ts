import { NextRequest, NextResponse } from "next/server";
import { getPost, updatePost, deletePost } from "@/lib/db";
import { isAuthorized } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const post = await getPost(params.id);
    if (!post) {
      return NextResponse.json({ erro: "Post não encontrado." }, { status: 404 });
    }
    if (post.status !== "published" && !isAuthorized(req)) {
      return NextResponse.json({ erro: "Post não encontrado." }, { status: 404 });
    }
    return NextResponse.json({ item: post });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ erro: "Não foi possível buscar o post." }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const post = await updatePost(params.id, body);
    if (!post) {
      return NextResponse.json({ erro: "Post não encontrado." }, { status: 404 });
    }
    return NextResponse.json({ item: post });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ erro: "Não foi possível atualizar o post." }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const ok = await deletePost(params.id);
    if (!ok) {
      return NextResponse.json({ erro: "Post não encontrado." }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ erro: "Não foi possível excluir o post." }, { status: 500 });
  }
}
