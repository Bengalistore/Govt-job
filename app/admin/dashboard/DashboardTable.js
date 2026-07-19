"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function fmt(d) {
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export default function DashboardTable({ jobs }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState(null);

  async function handleDelete(id) {
    if (!confirm("এই Job টি ডিলিট করতে চান?")) return;
    setDeletingId(id);
    await fetch(`/api/jobs/${id}`, { method: "DELETE" });
    setDeletingId(null);
    router.refresh();
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-white border border-line rounded-card p-10 text-center text-ink/50">
        এখনও কোনো job যোগ করা হয়নি।{" "}
        <Link href="/admin/dashboard/new" className="text-navy font-medium">
          প্রথম job যোগ করুন →
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white border border-line rounded-card overflow-x-auto">
      <table className="w-full text-sm min-w-[720px]">
        <thead>
          <tr className="text-left border-b border-line text-ink/50 text-xs uppercase tracking-wide">
            <th className="py-3 px-4 font-medium">Title</th>
            <th className="py-3 px-4 font-medium">Category</th>
            <th className="py-3 px-4 font-medium">Last Date</th>
            <th className="py-3 px-4 font-medium">Status</th>
            <th className="py-3 px-4 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job._id} className="border-b border-line/60 last:border-0">
              <td className="py-3 px-4 font-medium text-ink max-w-xs truncate">{job.title}</td>
              <td className="py-3 px-4 text-ink/70">{job.category}</td>
              <td className="py-3 px-4 font-mono-data text-ink/70">{fmt(job.lastDate)}</td>
              <td className="py-3 px-4">
                <span
                  className={`text-[11px] font-semibold uppercase px-2 py-0.5 rounded ${
                    job.status === "published" ? "bg-success/10 text-success" : "bg-ink/10 text-ink/60"
                  }`}
                >
                  {job.status}
                </span>
              </td>
              <td className="py-3 px-4 text-right space-x-3">
                <Link href={`/job/${job.slug}`} target="_blank" className="text-navy hover:underline">
                  View
                </Link>
                <Link href={`/admin/dashboard/edit/${job._id}`} className="text-navy hover:underline">
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(job._id)}
                  disabled={deletingId === job._id}
                  className="text-danger hover:underline disabled:opacity-50"
                >
                  {deletingId === job._id ? "..." : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
