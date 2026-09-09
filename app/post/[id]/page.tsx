import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPostBySlug } from "@/lib/db";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

export default async function PostPage({ params }: { params: { id: string } }) {
  const post = await getPostBySlug(params.id);
  if (!post || post.status !== "published") notFound();

  return (
    <div>
      <Header />

      <article className="pb-24">
        <div className="mx-auto max-w-[1180px] px-5 pt-12 sm:px-8">
          <a
            href="/"
            className="mb-8 inline-flex items-center gap-2 text-[13px] text-inkmuted transition hover:text-golddeep"
          >
            ← Voltar
          </a>

          <div className="mx-auto max-w-[760px] text-center">
            <p className="mb-[18px] text-[12.5px] tracking-[0.1em] text-golddeep">
              {post.category.toUpperCase()}
            </p>
            <h1 className="mb-[22px] font-display text-[clamp(32px,5vw,52px)] font-medium leading-[1.15]">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="mx-auto max-w-[600px] text-[17px] text-inkmuted">{post.excerpt}</p>
            ) : null}
          </div>
        </div>

        {post.coverImage ? (
          <div className="mt-12">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={post.coverImage}
              alt={post.title}
              className="max-h-[640px] w-full object-cover"
            />
          </div>
        ) : null}

        <div className="mx-auto max-w-[680px] px-5 sm:px-8">
          <div
            className="post-content mt-14"
            dangerouslySetInnerHTML={{ __html: post.contentHtml }}
          />

          <div className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-8 text-[13px] text-inkmuted">
            <span>
              Por {post.author} · {formatDate(post.publishedAt || post.createdAt)}
            </span>
            {post.tags.length > 0 ? (
              <span className="flex flex-wrap gap-2">
                {post.tags.map((t) => (
                  <span key={t} className="rounded-full border border-line px-3 py-1">
                    {t}
                  </span>
                ))}
              </span>
            ) : null}
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
}
