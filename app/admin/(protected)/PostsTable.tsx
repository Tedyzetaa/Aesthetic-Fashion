"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Post } from "@/lib/types";

export default function PostsTable({ initialPosts }: { initialPosts: Post[] }) {
  const router = useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [excluindo, setExcluindo] = useState<string | null>(null);

  async function handleDelete(id: string, title: string) {
    if (!confirm(`Excluir "${title}"? Essa ação não pode ser desfeita.`)) return;
    setExcluindo(id);
    try {
      const res = await fetch(`/api/posts/${id}`, { method: "DELETE" });
      if (res.ok) {
        setPosts((prev) => prev.filter((p) => p.id !== id));
        router.refresh();
      }
    } finally {
      setExcluindo(null);
    }
  }

  return (
    <div className="mt-4 overflow-hidden rounded-card border border-line bg-white shadow-card">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-line bg-base/60 text-xs uppercase tracking-wide text-inkmuted">
          <tr>
            <th className="px-4 py-3 font-medium">Post</th>
            <th className="px-4 py-3 font-medium">Categoria</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Atualizado</th>
            <th className="px-4 py-3 font-medium">Ações</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((p) => (
            <tr key={p.id} className="border-b border-line last:border-0">
              <td className="px-4 py-3">
                <Link
                  href={`/admin/posts/${p.id}`}
                  className="focus-ring font-medium text-ink hover:text-golddeep"
                >
                  {p.title}
                </Link>
              </td>
              <td className="px-4 py-3 text-inkmuted">{p.category}</td>
              <td className="px-4 py-3">
                <span
                  className={`rounded-full px-2 py-1 text-xs font-medium ${
                    p.status === "published"
                      ? "bg-golddeep/15 text-golddeep"
                      : "bg-inkmuted/10 text-inkmuted"
                  }`}
                >
                  {p.status === "published" ? "Publicado" : "Rascunho"}
                </span>
              </td>
              <td className="px-4 py-3 text-inkmuted">
                {new Date(p.updatedAt).toLocaleDateString("pt-BR")}
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-3">
                  <Link
                    href={`/admin/posts/${p.id}`}
                    className="focus-ring text-golddeep hover:underline"
                  >
                    Editar
                  </Link>
                  {p.status === "published" ? (
                    <a
                      href={`/post/${p.slug}`}
                      target="_blank"
                      rel="noreferrer"
                      className="focus-ring text-inkmuted hover:text-ink hover:underline"
                    >
                      Ver
                    </a>
                  ) : null}
                  <button
                    onClick={() => handleDelete(p.id, p.title)}
                    disabled={excluindo === p.id}
                    className="focus-ring text-alert hover:underline disabled:opacity-50"
                  >
                    {excluindo === p.id ? "Excluindo..." : "Excluir"}
                  </button>
                </div>
              </td>
            </tr>
          ))}
          {posts.length === 0 && (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-inkmuted">
                Nenhum post criado ainda.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
