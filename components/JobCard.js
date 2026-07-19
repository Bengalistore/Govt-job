import Link from "next/link";

function daysLeft(lastDate) {
  const diff = new Date(lastDate).setHours(23, 59, 59, 999) - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function formatDate(d) {
  return new Date(d).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric"
  });
}

export default function JobCard({ job }) {
  const left = daysLeft(job.lastDate);
  const isUrgent = left <= 7;
  const isClosed = left < 0;

  return (
    <Link href={`/job/${job.slug}`} className="block group">
      <article className="ticket-card grid grid-cols-[1fr_auto] h-full">
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-navy bg-navy-50 px-2 py-0.5 rounded">
              {job.category}
            </span>
            {job.state && job.state !== "All India" && (
              <span className="text-[11px] font-medium text-ink/50">{job.state}</span>
            )}
          </div>

          <h3 className="font-display font-semibold text-[15px] sm:text-base text-ink leading-snug group-hover:text-navy transition-colors line-clamp-2">
            {job.title}
          </h3>

          <p className="text-sm text-ink/60 mt-1">{job.organization}</p>

          <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-[13px]">
            <div>
              <dt className="text-ink/45">Vacancy</dt>
              <dd className="font-mono-data font-medium text-ink">{job.totalVacancy || "—"}</dd>
            </div>
            <div>
              <dt className="text-ink/45">Eligibility</dt>
              <dd className="font-medium text-ink truncate">{job.educationRequired}</dd>
            </div>
          </dl>
        </div>

        <div
          className={`ticket-stub w-[92px] sm:w-[104px] shrink-0 flex flex-col items-center justify-center text-center px-2 py-4 ${
            isClosed ? "bg-ink/5" : isUrgent ? "bg-gold-50" : "bg-navy-50"
          }`}
        >
          {isClosed ? (
            <span className="text-[11px] font-semibold text-ink/50">Closed</span>
          ) : (
            <>
              <span className="font-mono-data font-bold text-xl leading-none text-ink">
                {left}
              </span>
              <span className="text-[10px] font-medium text-ink/55 mt-1">days left</span>
            </>
          )}
          <span className="text-[10px] text-ink/45 mt-3 font-mono-data">{formatDate(job.lastDate)}</span>
        </div>
      </article>
    </Link>
  );
}
