"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="focus-ring w-full rounded-sm border border-line px-3 py-2 text-left text-sm text-inkmuted transition hover:border-alert hover:text-alert"
    >
      Sair
    </button>
  );
}
