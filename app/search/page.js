import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import JobCard from "@/components/JobCard";
import FilterSidebar from "@/components/FilterSidebar";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";

export const metadata = {
  title: "সব চাকরি খুঁজুন",
  description: "Category, state, district, job type ও education অনুযায়ী চাকরি ফিল্টার করুন।"
};

const PAGE_SIZE = 12;

async function getJobs(searchParams) {
  await connectDB();
  const filter = { status: "published" };

  if (searchParams.category) filter.category = searchParams.category;
  if (searchParams.state) filter.state = searchParams.state;
  if (searchParams.district) filter.district = searchParams.district;
  if (searchParams.jobType) filter.jobType = searchParams.jobType;
  if (searchParams.education) {
    filter.educationRequired = { $regex: searchParams.education, $options: "i" };
  }
  if (searchParams.expiringSoon === "true") {
    const now = new Date();
    const in7 = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    filter.lastDate = { $gte: now, $lte: in7 };
  }
  if (searchParams.q) {
    filter.$text = { $search: searchParams.q };
  }

  const page = parseInt(searchParams.page || "1", 10);

  const total = await Job.countDocuments(filter);
  const jobs = await Job.find(filter)
    .sort({ createdAt: -1 })
    .skip((page - 1) * PAGE_SIZE)
    .limit(PAGE_SIZE)
    .lean();

  return { jobs, total, page };
}

export default async function SearchPage({ searchParams }) {
  const { jobs, total, page } = await getJobs(searchParams);
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  function pageHref(p) {
    const params = new URLSearchParams(searchParams);
    params.set("page", p);
    return `/search?${params.toString()}`;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="mb-6 sm:hidden">
        <SearchBar defaultValue={searchParams.q || ""} />
      </div>

      <div className="grid lg:grid-cols-[260px_1fr] gap-6">
        <FilterSidebar />

        <div>
          <div className="flex items-baseline justify-between mb-4">
            <h1 className="font-display font-bold text-xl text-ink">
              {total} টি চাকরি পাওয়া গেছে
            </h1>
          </div>

          {jobs.length === 0 ? (
            <div className="bg-white border border-line rounded-card p-10 text-center text-ink/50">
              এই ফিল্টারে কোনো চাকরি পাওয়া যায়নি। অন্য ফিল্টার চেষ্টা করুন।
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Link
                  key={p}
                  href={pageHref(p)}
                  className={`w-9 h-9 grid place-items-center rounded-md text-sm font-medium border ${
                    p === page ? "bg-navy text-white border-navy" : "border-line text-ink/70 hover:border-navy"
                  }`}
                >
                  {p}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
