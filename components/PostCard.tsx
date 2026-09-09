import Link from "next/link";
import { Post } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric"
  });
}

export default function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <Link href={`/post/${post.slug}`} className="group block">
      <div
        className={`mb-[18px] overflow-hidden bg-card ${
          featured ? "aspect-[16/13]" : "aspect-[4/5]"
        }`}
      >
        {post.coverImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={post.coverImage}
            alt={post.title}
            className="h-full w-full object-cover transition-transform duration-[700ms] ease-out group-hover:scale-[1.045]"
          />
        ) : null}
      </div>
      <p className="mb-2.5 text-[11.5px] tracking-[0.14em] text-golddeep">
        {post.category.toUpperCase()}
      </p>
      <h3
        className={`mb-2.5 font-display font-medium leading-[1.28] ${
          featured ? "text-[32px]" : "text-[23px]"
        }`}
      >
        {post.title}
      </h3>
      <p className="mb-3 line-clamp-2 text-[14.5px] text-inkmuted">{post.excerpt}</p>
      <p className="text-[12px] text-inkmuted/75">
        {post.author} · {formatDate(post.publishedAt || post.createdAt)}
      </p>
    </Link>
  );
}
