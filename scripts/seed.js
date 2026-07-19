// Run with: node scripts/seed.js
// Make sure MONGODB_URI is set in your .env.local (or export it before running).

require("dotenv").config({ path: ".env.local" });
const mongoose = require("mongoose");
const slugify = require("slugify");

const JobSchema = new mongoose.Schema({}, { strict: false, timestamps: true });
const Job = mongoose.models.Job || mongoose.model("Job", JobSchema);

const sampleJobs = [
  {
    title: "Staff Nurse Recruitment 2026",
    organization: "West Bengal Health Recruitment Board",
    category: "Medical & Health",
    jobType: "Government",
    state: "West Bengal",
    district: "Kolkata",
    totalVacancy: 1250,
    vacancyDetails: [
      { postName: "Staff Nurse (General)", count: 1000, eligibility: "GNM / B.Sc Nursing" },
      { postName: "Staff Nurse (ICU)", count: 250, eligibility: "B.Sc Nursing + 1 yr experience" }
    ],
    educationRequired: "GNM / B.Sc Nursing",
    eligibilityDetails: "Candidates must be registered with West Bengal Nursing Council.",
    ageMin: 18,
    ageMax: 40,
    ageRelaxation: "OBC +3 years, SC/ST +5 years as per govt rules",
    salary: "Rs. 25,500 - 81,100 (Pay Level 8)",
    applicationStartDate: new Date(),
    lastDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
    importantDates: [
      { label: "Written Exam Date", date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
    ],
    applicationFee: "General/OBC: Rs. 210 | SC/ST/PWD: Exempted",
    howToApply: "Interested candidates should apply online through the official website. Upload scanned photo, signature and required certificates before submitting.",
    officialNotificationUrl: "https://example.com/notification.pdf",
    applyOnlineUrl: "https://example.com/apply",
    officialWebsiteUrl: "https://example.com",
    description: "West Bengal Health Recruitment Board has released a notification for the recruitment of Staff Nurses across government hospitals in the state. Eligible candidates can apply online before the last date.",
    faqs: [
      { question: "আবেদনের বয়সসীমা কত?", answer: "সাধারণ ক্যাটাগরির জন্য ১৮-৪০ বছর, সংরক্ষিত ক্যাটাগরির জন্য বয়সে ছাড় প্রযোজ্য।" },
      { question: "আবেদন ফি কত?", answer: "জেনারেল/ওবিসি প্রার্থীদের জন্য ২১০ টাকা, এসসি/এসটি/পিডব্লিউডি প্রার্থীরা মুক্ত।" }
    ],
    status: "published",
    featured: true
  },
  {
    title: "Junior Engineer (Civil) — RRB Recruitment",
    organization: "Railway Recruitment Board",
    category: "Railway",
    jobType: "Railway",
    state: "All India",
    district: "",
    totalVacancy: 3400,
    vacancyDetails: [{ postName: "Junior Engineer (Civil)", count: 3400, eligibility: "Diploma/B.Tech in Civil Engineering" }],
    educationRequired: "Diploma / B.Tech (Civil)",
    ageMin: 18,
    ageMax: 33,
    ageRelaxation: "As per railway board norms",
    salary: "Rs. 35,400 - 1,12,400 (Level 6)",
    lastDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
    applicationFee: "General: Rs. 500 (Rs. 400 refundable) | SC/ST/Female: Rs. 250",
    howToApply: "Apply online via the RRB regional website. Keep scanned documents ready before starting the form.",
    officialWebsiteUrl: "https://example.com",
    description: "Railway Recruitment Board invites online applications for Junior Engineer posts across various railway zones.",
    faqs: [],
    status: "published"
  }
];

async function run() {
  await mongoose.connect(process.env.MONGODB_URI);
  for (const job of sampleJobs) {
    job.slug = slugify(job.title, { lower: true, strict: true });
    await Job.findOneAndUpdate({ slug: job.slug }, job, { upsert: true, new: true });
    console.log("Seeded:", job.title);
  }
  await mongoose.disconnect();
  console.log("Done.");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
