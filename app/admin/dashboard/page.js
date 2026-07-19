import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import Link from "next/link";
import DashboardTable from "./DashboardTable";
import LogoutButton from "@/components/admin/LogoutButton";

// Admin data must always be fresh — never statically cache this page.
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  await connectDB();
  const jobs = await Job.find({}).sort({ createdAt: -1 }).lean();

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-bold text-xl">Admin Dashboard</h1>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/dashboard/new"
            className="bg-navy text-white text-sm font-semibold rounded-md px-4 py-2 hover:bg-navy-700"
          >
            + নতুন Job
          </Link>
          <LogoutButton />
        </div>
      </div>

      <DashboardTable jobs={JSON.parse(JSON.stringify(jobs))} />
    </div>
  );
}
