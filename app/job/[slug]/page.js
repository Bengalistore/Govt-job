import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import JobCard from "@/components/JobCard";
import { notFound } from "next/navigation";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const revalidate = 300; // cache each job page for 5 minutes

async function getJob(slug) {
  await connectDB();
  const job = await Job.findOne({ slug, status: "published" }).lean();
  return job;
}

function fmt(d) {
  if (!d) return null;
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
}

export async function generateMetadata({ params }) {
  const job = await getJob(params.slug);
  if (!job) return {};

  const title = job.metaTitle || `${job.title} ${new Date(job.lastDate).getFullYear()} — Vacancy ${job.totalVacancy || ""}, Last Date ${fmt(job.lastDate)}`;
  const description =
    job.metaDescription ||
    `${job.organization} নিয়োগ বিজ্ঞপ্তি — মোট ${job.totalVacancy || ""} শূন্যপদ। যোগ্যতা: ${job.educationRequired}। আবেদনের শেষ তারিখ: ${fmt(job.lastDate)}। বেতন, বয়সসীমা ও আবেদন প্রক্রিয়া বিস্তারিত জানুন।`;

  return {
    title,
    description,
    alternates: { canonical: `${SITE_URL}/job/${job.slug}` },
    openGraph: { title, description, type: "article" }
  };
}

export default async function JobDetailsPage({ params }) {
  const job = await getJob(params.slug);
  if (!job) notFound();

  await connectDB();
  const related = await Job.find({
    status: "published",
    category: job.category,
    _id: { $ne: job._id }
  })
    .sort({ createdAt: -1 })
    .limit(3)
    .lean();

  const jsonLd = {
    "@context": "https://schema.org/",
    "@type": "JobPosting",
    title: job.title,
    description: job.description || job.educationRequired,
    datePosted: job.createdAt,
    validThrough: job.lastDate,
    employmentType: job.jobType === "Private" ? "FULL_TIME" : "FULL_TIME",
    hiringOrganization: {
      "@type": "Organization",
      name: job.organization
    },
    jobLocation: {
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        addressRegion: job.state,
        addressLocality: job.district || undefined,
        addressCountry: "IN"
      }
    },
    baseSalary: job.salary
      ? { "@type": "MonetaryAmount", currency: "INR", value: { "@type": "QuantitativeValue", value: job.salary } }
      : undefined
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* breadcrumb-ish header */}
      <div className="flex items-center gap-2 text-xs text-ink/50 mb-4">
        <span>{job.category}</span>
        <span>/</span>
        <span>{job.state}</span>
      </div>

      <div className="grid lg:grid-cols-[1fr_300px] gap-8">
        <div>
          <header className="bg-white border border-line rounded-card p-5 sm:p-7 mb-6">
            <span className="text-[11px] font-semibold uppercase tracking-wide text-navy bg-navy-50 px-2 py-0.5 rounded">
              {job.jobType}
            </span>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-ink mt-3 leading-snug">
              {job.title}
            </h1>
            <p className="text-ink/60 mt-1">{job.organization}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-line">
              <Stat label="Total Vacancy" value={job.totalVacancy || "—"} />
              <Stat label="Last Date" value={fmt(job.lastDate)} highlight />
              <Stat label="Salary" value={job.salary || "As per norms"} />
              <Stat label="Location" value={job.district ? `${job.district}, ${job.state}` : job.state} />
            </div>
          </header>

          {job.description && (
            <Section title="বিজ্ঞপ্তি সম্পর্কে">
              <p className="whitespace-pre-line text-[15px] leading-relaxed text-ink/80">{job.description}</p>
            </Section>
          )}

          {job.vacancyDetails?.length > 0 && (
            <Section title="Vacancy Details">
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="text-left border-b border-line text-ink/50">
                      <th className="py-2 pr-4 font-medium">Post Name</th>
                      <th className="py-2 pr-4 font-medium">Vacancy</th>
                      <th className="py-2 font-medium">Eligibility</th>
                    </tr>
                  </thead>
                  <tbody>
                    {job.vacancyDetails.map((v, i) => (
                      <tr key={i} className="border-b border-line/60">
                        <td className="py-2.5 pr-4 font-medium text-ink">{v.postName}</td>
                        <td className="py-2.5 pr-4 font-mono-data">{v.count}</td>
                        <td className="py-2.5 text-ink/70">{v.eligibility}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Section>
          )}

          <Section title="Eligibility Criteria">
            <dl className="grid sm:grid-cols-2 gap-4 text-sm">
              <div>
                <dt className="text-ink/45 mb-0.5">Education</dt>
                <dd className="font-medium">{job.educationRequired}</dd>
              </div>
              {(job.ageMin || job.ageMax) && (
                <div>
                  <dt className="text-ink/45 mb-0.5">Age Limit</dt>
                  <dd className="font-medium">
                    {job.ageMin || "—"} – {job.ageMax || "—"} বছর
                  </dd>
                </div>
              )}
              {job.ageRelaxation && (
                <div className="sm:col-span-2">
                  <dt className="text-ink/45 mb-0.5">Age Relaxation</dt>
                  <dd>{job.ageRelaxation}</dd>
                </div>
              )}
              {job.eligibilityDetails && (
                <div className="sm:col-span-2">
                  <dd className="whitespace-pre-line text-ink/75">{job.eligibilityDetails}</dd>
                </div>
              )}
            </dl>
          </Section>

          {(job.importantDates?.length > 0 || job.applicationStartDate || job.lastDate) && (
            <Section title="Important Dates">
              <ul className="divide-y divide-line">
                {job.applicationStartDate && (
                  <DateRow label="Application Start" value={fmt(job.applicationStartDate)} />
                )}
                {job.importantDates?.map((d, i) => (
                  <DateRow key={i} label={d.label} value={fmt(d.date)} />
                ))}
                <DateRow label="Last Date to Apply" value={fmt(job.lastDate)} highlight />
              </ul>
            </Section>
          )}

          {job.applicationFee && (
            <Section title="Application Fee">
              <p className="text-sm text-ink/80 whitespace-pre-line">{job.applicationFee}</p>
            </Section>
          )}

          {job.howToApply && (
            <Section title="Application Process">
              <p className="text-sm text-ink/80 whitespace-pre-line leading-relaxed">{job.howToApply}</p>
            </Section>
          )}

          {(job.officialNotificationUrl || job.applyOnlineUrl || job.officialWebsiteUrl) && (
            <Section title="Important Links">
              <div className="flex flex-wrap gap-3">
                {job.applyOnlineUrl && (
                  <LinkButton href={job.applyOnlineUrl} primary>Apply Online</LinkButton>
                )}
                {job.officialNotificationUrl && (
                  <LinkButton href={job.officialNotificationUrl}>Official Notification (PDF)</LinkButton>
                )}
                {job.officialWebsiteUrl && (
                  <LinkButton href={job.officialWebsiteUrl}>Official Website</LinkButton>
                )}
              </div>
            </Section>
          )}

          {job.faqs?.length > 0 && (
            <Section title="FAQ">
              <div className="divide-y divide-line">
                {job.faqs.map((f, i) => (
                  <details key={i} className="py-3 group">
                    <summary className="font-medium text-sm text-ink cursor-pointer list-none flex justify-between items-center">
                      {f.question}
                      <span className="text-ink/40 group-open:rotate-45 transition-transform">+</span>
                    </summary>
                    <p className="text-sm text-ink/70 mt-2 leading-relaxed">{f.answer}</p>
                  </details>
                ))}
              </div>
            </Section>
          )}
        </div>

        <aside className="lg:sticky lg:top-20 h-fit space-y-4">
          <div className="bg-white border border-line rounded-card p-4">
            <h4 className="font-display font-semibold text-sm mb-3">একই Category-র চাকরি</h4>
            <div className="space-y-3">
              {related.length === 0 && <p className="text-xs text-ink/45">আপাতত নেই।</p>}
              {related.map((r) => (
                <JobCard key={r._id} job={r} />
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value, highlight }) {
  return (
    <div>
      <p className="text-[11px] uppercase tracking-wide text-ink/45 mb-0.5">{label}</p>
      <p className={`font-mono-data font-semibold text-sm ${highlight ? "text-danger" : "text-ink"}`}>{value}</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section className="bg-white border border-line rounded-card p-5 sm:p-7 mb-6">
      <h2 className="font-display font-bold text-lg text-ink mb-4">{title}</h2>
      {children}
    </section>
  );
}

function DateRow({ label, value, highlight }) {
  return (
    <li className="flex items-center justify-between py-2.5 text-sm">
      <span className="text-ink/60">{label}</span>
      <span className={`font-mono-data font-medium ${highlight ? "text-danger" : "text-ink"}`}>{value}</span>
    </li>
  );
}

function LinkButton({ href, children, primary }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`text-sm font-semibold px-4 py-2.5 rounded-md transition-colors ${
        primary ? "bg-navy text-white hover:bg-navy-700" : "border border-line text-ink hover:border-navy"
      }`}
    >
      {children}
    </a>
  );
}
