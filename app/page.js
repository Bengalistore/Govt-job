import Link from "next/link";
import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import JobCard from "@/components/JobCard";
import SearchBar from "@/components/SearchBar";
import { CATEGORIES, STATE_NAMES, JOB_TYPES } from "@/lib/data";

export const revalidate = 300; // ISR: refresh every 5 minutes

async function getHomeData() {
  await connectDB();

  const now = new Date();
  const in7days = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const [expiringSoon, latest, ...categoryResults] = await Promise.all([
    Job.find({ status: "published", lastDate: { $gte: now, $lte: in7days } })
      .sort({ lastDate: 1 })
      .limit(6)
      .lean(),
    Job.find({ status: "published" }).sort({ createdAt: -1 }).limit(8).lean(),
    ...CATEGORIES.map((c) =>
      Job.find({ status: "published", category: c }).sort({ createdAt: -1 }).limit(4).lean()
    )
  ]);

  const totalOpen = await Job.countDocuments({ status: "published", lastDate: { $gte: now } });

  const byCategory = CATEGORIES.map((c, i) => ({ category: c, jobs: categoryResults[i] })).filter(
    (g) => g.jobs.length > 0
  );

  return { expiringSoon, latest, byCategory, totalOpen };
}

export default async function HomePage() {
  const { expiringSoon, latest, byCategory, totalOpen } = await getHomeData();

  return (
    <div>
      {/* Hero */}
      <section className="bg-navy relative overflow-hidden">
        <div className="max-w-6xl mx-auto px-4 py-14 sm:py-20 relative">
          <p className="text-gold font-mono-data text-xs sm:text-sm tracking-widest uppercase mb-3">
            {totalOpen}+ Live Openings
          </p>
          <h1 className="font-display font-extrabold text-white text-3xl sm:text-5xl leading-tight max-w-2xl">
            সরকারি ও বেসরকারি চাকরির সব খবর, এক জায়গায়
          </h1>
          <p className="text-white/75 mt-4 max-w-xl text-sm sm:text-base">
            Vacancy, eligibility, salary আর last date — প্রতিদিনের যাচাই করা আপডেট।
          </p>
          <div className="mt-7 max-w-xl">
            <SearchBar />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4">
        {/* Expiring soon */}
        {expiringSoon.length > 0 && (
          <section className="-mt-8 relative z-10 mb-14">
            <div className="bg-white border border-line rounded-card shadow-card p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-display font-bold text-lg text-ink flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-danger inline-block" />
                  শেষ হচ্ছে ৭ দিনের মধ্যে
                </h2>
                <Link href="/search?expiringSoon=true" className="text-sm font-medium text-navy hover:underline">
                  সব দেখুন →
                </Link>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {expiringSoon.map((job) => (
                  <JobCard key={job._id} job={job} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Quick filters */}
        <section className="mb-14">
          <h2 className="font-display font-bold text-lg text-ink mb-4">Quick Filter</h2>
          <div className="flex flex-wrap gap-2">
            {JOB_TYPES.map((t) => (
              <Link
                key={t}
                href={`/search?jobType=${encodeURIComponent(t)}`}
                className="text-sm font-medium bg-white border border-line rounded-full px-4 py-1.5 hover:border-navy hover:text-navy transition-colors"
              >
                {t}
              </Link>
            ))}
            {STATE_NAMES.slice(1, 7).map((s) => (
              <Link
                key={s}
                href={`/search?state=${encodeURIComponent(s)}`}
                className="text-sm font-medium bg-white border border-line rounded-full px-4 py-1.5 hover:border-navy hover:text-navy transition-colors"
              >
                {s}
              </Link>
            ))}
          </div>
        </section>

        {/* Latest jobs */}
        {latest.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-ink">সর্বশেষ পোস্ট হওয়া চাকরি</h2>
              <Link href="/search" className="text-sm font-medium text-navy hover:underline">
                সব দেখুন →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {latest.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          </section>
        )}

        {/* Category sections */}
        {byCategory.map(({ category, jobs }) => (
          <section key={category} className="mb-14">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display font-bold text-lg text-ink">{category}</h2>
              <Link
                href={`/search?category=${encodeURIComponent(category)}`}
                className="text-sm font-medium text-navy hover:underline"
              >
                সব দেখুন →
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {jobs.map((job) => (
                <JobCard key={job._id} job={job} />
              ))}
            </div>
          </section>
        ))}

        {byCategory.length === 0 && latest.length === 0 && (
          <div className="text-center py-20 text-ink/50">
            এখনও কোনো চাকরি যোগ করা হয়নি। Admin panel থেকে প্রথম job পোস্ট করুন।
          </div>
        )}
      </div>
    </div>
  );
}
