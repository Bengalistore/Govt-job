import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap() {
  await connectDB();
  const jobs = await Job.find({ status: "published" }).select("slug updatedAt").lean();

  const jobUrls = jobs.map((j) => ({
    url: `${SITE_URL}/job/${j.slug}`,
    lastModified: j.updatedAt,
    changeFrequency: "daily",
    priority: 0.8
  }));

  return [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/search`, lastModified: new Date(), changeFrequency: "hourly", priority: 0.6 },
    ...jobUrls
  ];
}
