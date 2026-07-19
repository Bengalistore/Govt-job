"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ compact = false, defaultValue = "" }) {
  const router = useRouter();
  const [q, setQ] = useState(defaultValue);

  function handleSubmit(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Post name, department বা organization লিখুন..."
        className={`w-full rounded-full border border-line bg-paper focus:bg-white pl-4 pr-11 ${
          compact ? "py-2 text-sm" : "py-3 text-base"
        } outline-none focus:border-navy transition-colors`}
      />
      <button
        type="submit"
        aria-label="Search jobs"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-navy text-white grid place-items-center"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
      </button>
    </form>
  );
}
