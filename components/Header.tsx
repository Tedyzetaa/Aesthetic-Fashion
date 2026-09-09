"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORIES } from "@/lib/types";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-base/90 backdrop-blur-md">
      <div className="mx-auto flex h-[84px] max-w-[1180px] items-center justify-between px-5 sm:px-8">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-display text-[26px] font-semibold tracking-wide">AF</span>
          <span className="mt-1.5 font-body text-[9px] font-medium tracking-[0.28em] text-inkmuted">
            AESTHETIC FASHION
          </span>
        </Link>

        <nav
          className={`${
            open ? "max-h-[320px]" : "max-h-0"
          } fixed left-0 right-0 top-[84px] flex flex-col items-start gap-0 overflow-hidden border-b border-line bg-base transition-[max-height] duration-300 sm:static sm:flex sm:max-h-none sm:flex-row sm:items-center sm:gap-9 sm:overflow-visible sm:border-none sm:bg-transparent`}
        >
          <Link
            href="/"
            className="w-full border-b border-line px-8 py-4 text-[13.5px] tracking-wide transition hover:text-golddeep sm:w-auto sm:border-none sm:px-0 sm:py-1.5 sm:border-b sm:border-transparent hover:sm:border-golddeep"
            onClick={() => setOpen(false)}
          >
            Início
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c}
              href={`/?categoria=${encodeURIComponent(c)}`}
              className="w-full border-b border-line px-8 py-4 text-[13.5px] tracking-wide transition hover:text-golddeep sm:w-auto sm:border-none sm:px-0 sm:py-1.5 sm:border-b sm:border-transparent hover:sm:border-golddeep"
              onClick={() => setOpen(false)}
            >
              {c}
            </Link>
          ))}
        </nav>

        <button
          className="focus-ring rounded-sm border border-line px-3 py-2 text-sm sm:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Abrir menu"
        >
          {open ? "✕" : "☰"}
        </button>
      </div>
    </header>
  );
}
