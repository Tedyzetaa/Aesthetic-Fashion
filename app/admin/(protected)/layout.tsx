import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { SESSION_COOKIE_NAME, verifySessionToken } from "@/lib/auth";
import LogoutButton from "./LogoutButton";

export default function AdminProtectedLayout({ children }: { children: React.ReactNode }) {
  const token = cookies().get(SESSION_COOKIE_NAME)?.value;
  if (!verifySessionToken(token)) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[#FCFBF8] font-body">
      <div className="flex min-h-screen">
        <aside className="hidden w-60 flex-col border-r border-line bg-white px-5 py-6 md:flex">
          <Link href="/admin" className="font-display text-lg">
            <span className="font-semibold">AF</span>
          </Link>
          <p className="mb-8 mt-1 text-[10px] uppercase tracking-[0.2em] text-inkmuted">
            Sala de redação
          </p>

          <nav className="flex flex-col gap-1 text-sm">
            <Link
              href="/admin"
              className="focus-ring rounded-sm px-3 py-2 text-inkmuted transition hover:bg-base hover:text-ink"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/posts/novo"
              className="focus-ring rounded-sm px-3 py-2 text-inkmuted transition hover:bg-base hover:text-ink"
            >
              Novo post
            </Link>
            <Link
              href="/"
              className="focus-ring rounded-sm px-3 py-2 text-inkmuted transition hover:bg-base hover:text-ink"
            >
              Ver site
            </Link>
          </nav>

          <div className="mt-auto pt-6">
            <LogoutButton />
          </div>
        </aside>

        <main className="flex-1 px-5 py-8 md:px-10 md:py-10">{children}</main>
      </div>
    </div>
  );
}
