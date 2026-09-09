"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [enviando, setEnviando] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro("");
    setEnviando(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha })
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErro(data.erro || "Não foi possível entrar.");
        return;
      }
      const redirect = searchParams.get("redirect") || "/admin";
      router.push(redirect);
      router.refresh();
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-5">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-display text-2xl">
            <span className="font-semibold">AF</span>
          </p>
          <p className="mt-1 text-xs uppercase tracking-[0.28em] text-inkmuted">
            Painel administrativo
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-card border border-line bg-white p-7 shadow-card"
        >
          <label className="block text-sm font-medium text-ink">
            E-mail
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="focus-ring mt-1.5 w-full rounded-sm border border-line px-3 py-2.5 text-sm"
              placeholder="voce@seudominio.com"
            />
          </label>

          <label className="mt-4 block text-sm font-medium text-ink">
            Senha
            <input
              type="password"
              required
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="focus-ring mt-1.5 w-full rounded-sm border border-line px-3 py-2.5 text-sm"
              placeholder="••••••••"
            />
          </label>

          {erro && (
            <p className="mt-3 rounded-sm bg-alert/10 px-3 py-2 text-sm text-alert">{erro}</p>
          )}

          <button
            type="submit"
            disabled={enviando}
            className="focus-ring mt-6 w-full rounded-full bg-ink py-3 text-sm font-semibold text-base transition hover:bg-golddeep disabled:opacity-60"
          >
            {enviando ? "Entrando..." : "Entrar"}
          </button>
        </form>
      </div>
    </div>
  );
}
