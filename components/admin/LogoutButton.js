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
      className="text-sm font-medium text-ink/60 border border-line rounded-md px-4 py-2 hover:border-danger hover:text-danger"
    >
      Logout
    </button>
  );
}
