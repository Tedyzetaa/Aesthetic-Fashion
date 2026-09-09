import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-line py-14">
      <div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-5 px-5 sm:px-8">
        <span className="font-display text-[19px]">Aesthetic Fashion</span>
        <p className="text-[12.5px] text-inkmuted">
          © {new Date().getFullYear()} Aesthetic Fashion. Curadoria e texto autorais.
        </p>
        <Link
          href="/admin"
          className="border-b border-line text-[12px] text-inkmuted transition hover:border-golddeep hover:text-golddeep"
        >
          Admin
        </Link>
      </div>
    </footer>
  );
}
