import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostCard from "@/components/PostCard";
import { listPosts } from "@/lib/db";
import { CATEGORIES } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function HomePage({
  searchParams
}: {
  searchParams: { categoria?: string };
}) {
  const categoria = searchParams.categoria;
  const posts = await listPosts({ category: categoria });

  return (
    <div>
      <Header />

      <section className="border-b border-line py-24 text-center">
        <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
          <p className="mb-[22px] text-xs tracking-[0.18em] text-golddeep">DIÁRIO EDITORIAL</p>
          <h1 className="mx-auto mb-[26px] max-w-[820px] font-display text-[clamp(38px,6vw,72px)] font-medium leading-[1.08]">
            Moda como <em className="text-golddeep not-italic italic">linguagem</em> pessoal
          </h1>
          <p className="mx-auto max-w-[520px] text-[16.5px] text-inkmuted">
            Curadoria visual e reflexões sobre estilo, atitude e o que vestimos quando
            escolhemos quem somos.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1180px] px-5 sm:px-8">
        <div className="flex flex-wrap justify-center gap-2.5 py-10">
          <FilterChip label="Tudo" href="/" active={!categoria} />
          {CATEGORIES.map((c) => (
            <FilterChip key={c} label={c} href={`/?categoria=${c}`} active={categoria === c} />
          ))}
        </div>

        {posts.length === 0 ? (
          <div className="py-20 text-center text-inkmuted">
            <h3 className="mb-2.5 font-display text-[26px] text-ink">Nada por aqui ainda</h3>
            <p>Os primeiros posts aparecem assim que forem publicados.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-x-8 gap-y-11 pb-24 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post, i) => (
              <div key={post.id} className={i === 0 ? "sm:col-span-2 lg:col-span-2" : ""}>
                <PostCard post={post} featured={i === 0} />
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

function FilterChip({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <a
      href={href}
      className={`rounded-full border px-5 py-2.5 text-[13px] tracking-wide transition ${
        active
          ? "border-golddeep bg-gold text-white"
          : "border-line text-inkmuted hover:border-golddeep hover:bg-gold hover:text-white"
      }`}
    >
      {label}
    </a>
  );
}
