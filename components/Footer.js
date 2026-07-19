import Link from "next/link";
import { CATEGORIES } from "@/lib/data";

export default function Footer() {
  return (
    <footer className="bg-navy-900 bg-navy text-white mt-16">
      <div className="max-w-6xl mx-auto px-4 py-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="w-8 h-8 rounded-md bg-white text-navy grid place-items-center font-display font-bold text-sm">
              JN
            </span>
            <span className="font-display font-bold text-lg">JobNews</span>
          </div>
          <p className="text-sm text-white/70 leading-relaxed">
            প্রতিদিনের সরকারি ও বেসরকারি চাকরির নির্ভরযোগ্য আপডেট — vacancy,
            eligibility, last date সহ সম্পূর্ণ তথ্য একসাথে।
          </p>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3 text-sm tracking-wide uppercase text-gold">
            Category
          </h4>
          <ul className="space-y-2 text-sm text-white/75">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c}>
                <Link href={`/search?category=${encodeURIComponent(c)}`} className="hover:text-white">
                  {c}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3 text-sm tracking-wide uppercase text-gold">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm text-white/75">
            <li><Link href="/" className="hover:text-white">হোম</Link></li>
            <li><Link href="/search?expiringSoon=true" className="hover:text-white">শেষ হচ্ছে শীঘ্রই</Link></li>
            <li><Link href="/search" className="hover:text-white">সব চাকরি খুঁজুন</Link></li>
            <li><Link href="/admin/login" className="hover:text-white">Admin Login</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display font-semibold mb-3 text-sm tracking-wide uppercase text-gold">
            জরুরি নোট
          </h4>
          <p className="text-sm text-white/70 leading-relaxed">
            আবেদন করার আগে সবসময় অফিসিয়াল নোটিফিকেশন ভালোভাবে যাচাই করে নিন।
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/50">
        © {new Date().getFullYear()} JobNews. All rights reserved.
      </div>
    </footer>
  );
}
