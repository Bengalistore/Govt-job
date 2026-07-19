import Link from "next/link";
import SearchBar from "./SearchBar";

const NAV_LINKS = [
  { href: "/", label: "হোম" },
  { href: "/search?category=Railway", label: "রেলওয়ে" },
  { href: "/search?category=Banking", label: "ব্যাংক" },
  { href: "/search?category=State Govt", label: "স্টেট গভ" },
  { href: "/search?expiringSoon=true", label: "শেষ হচ্ছে শীঘ্রই" }
];

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-line">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="w-9 h-9 rounded-md bg-navy text-white grid place-items-center font-display font-bold text-sm">
              JN
            </span>
            <span className="font-display font-bold text-lg text-ink">
              Job<span className="text-navy">News</span>
            </span>
          </Link>

          <div className="hidden md:block flex-1 max-w-md">
            <SearchBar compact />
          </div>

          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-ink/80 shrink-0">
            {NAV_LINKS.map((l) => (
              <Link key={l.label} href={l.href} className="hover:text-navy transition-colors">
                {l.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/search"
            className="lg:hidden text-sm font-semibold text-navy border border-navy/20 rounded-md px-3 py-1.5"
          >
            খুঁজুন
          </Link>
        </div>
      </div>
    </header>
  );
}
