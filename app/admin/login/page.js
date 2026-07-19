"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    setLoading(false);
    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      const data = await res.json();
      setError(data.error || "Login failed");
    }
  }

  return (
    <div className="min-h-[70vh] grid place-items-center px-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm bg-white border border-line rounded-card p-7">
        <h1 className="font-display font-bold text-xl mb-1">Admin Login</h1>
        <p className="text-sm text-ink/50 mb-6">Job পোস্ট ও ম্যানেজ করতে লগইন করুন।</p>

        {error && (
          <p className="text-sm text-danger bg-danger/5 border border-danger/20 rounded-md px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <label className="block text-xs font-semibold uppercase tracking-wide text-ink/50 mb-1.5">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border border-line px-3 py-2 text-sm mb-4 outline-none focus:border-navy"
        />

        <label className="block text-xs font-semibold uppercase tracking-wide text-ink/50 mb-1.5">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-line px-3 py-2 text-sm mb-6 outline-none focus:border-navy"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-navy text-white font-semibold text-sm rounded-md py-2.5 hover:bg-navy-700 transition-colors disabled:opacity-60"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
