import mongoose from "mongoose";

const VacancyPostSchema = new mongoose.Schema(
  {
    postName: String,
    count: Number,
    eligibility: String
  },
  { _id: false }
);

const ImportantDateSchema = new mongoose.Schema(
  {
    label: String, // e.g. "Application Start", "Last Date to Apply", "Exam Date"
    date: Date
  },
  { _id: false }
);

const FaqSchema = new mongoose.Schema(
  {
    question: String,
    answer: String
  },
  { _id: false }
);

const JobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    organization: { type: String, required: true },

    category: { type: String, required: true, index: true }, // e.g. Railway, Banking, Teaching, Police, State Govt
    jobType: { type: String, required: true, index: true }, // Government / Private / Bank / PSU / Railway / Defence
    state: { type: String, required: true, index: true }, // "All India" or a specific state
    district: { type: String, default: "" },

    totalVacancy: { type: Number, default: 0 },
    vacancyDetails: [VacancyPostSchema],

    educationRequired: { type: String, required: true }, // headline eligibility shown on cards
    eligibilityDetails: { type: String }, // long form details

    ageMin: Number,
    ageMax: Number,
    ageRelaxation: String,

    salary: { type: String }, // free text, e.g. "Rs. 25,500 - 81,100 (Level 4)"

    applicationStartDate: Date,
    lastDate: { type: Date, required: true, index: true },
    importantDates: [ImportantDateSchema],

    applicationFee: { type: String },
    howToApply: { type: String },

    officialNotificationUrl: String,
    applyOnlineUrl: String,
    officialWebsiteUrl: String,

    description: { type: String },
    faqs: [FaqSchema],

    status: { type: String, enum: ["draft", "published"], default: "published" },
    featured: { type: Boolean, default: false },

    metaTitle: String,
    metaDescription: String
  },
  { timestamps: true }
);

JobSchema.index({ title: "text", organization: "text", category: "text" });

export default mongoose.models.Job || mongoose.model("Job", JobSchema);
