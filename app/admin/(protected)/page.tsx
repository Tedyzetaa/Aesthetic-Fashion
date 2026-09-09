import Link from "next/link";
import { getStats, listPosts } from "@/lib/db";
import PostsTable from "./PostsTable";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const stats = await getStats();
  const posts = await listPosts();

  const cards = [
    { label: "Posts no total", valor: stats.total },
    { label: "Publicados", valor: stats.publicados },
    { label: "Rascunhos", valor: stats.rascunhos },
    { label: "Categorias em uso", valor: stats.categorias }
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl">Dashboard</h1>
          <p className="mt-1 text-sm text-inkmuted">Gestão dos posts do Aesthetic Fashion.</p>
        </div>
        <Link
          href="/admin/posts/novo"
          className="focus-ring rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-base transition hover:bg-golddeep"
        >
          + Novo post
        </Link>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-card border border-line bg-white p-5 shadow-card">
            <p className="font-display text-3xl">{c.valor}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-inkmuted">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg">Todos os posts</h2>
        <PostsTable initialPosts={posts} />
      </div>
    </div>
  );
}
