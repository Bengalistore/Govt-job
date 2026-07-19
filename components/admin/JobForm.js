"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, JOB_TYPES, STATE_NAMES, STATES } from "@/lib/data";

const EMPTY_JOB = {
  title: "",
  organization: "",
  category: CATEGORIES[0],
  jobType: JOB_TYPES[0],
  state: STATE_NAMES[0],
  district: "",
  totalVacancy: "",
  vacancyDetails: [],
  educationRequired: "",
  eligibilityDetails: "",
  ageMin: "",
  ageMax: "",
  ageRelaxation: "",
  salary: "",
  applicationStartDate: "",
  lastDate: "",
  importantDates: [],
  applicationFee: "",
  howToApply: "",
  officialNotificationUrl: "",
  applyOnlineUrl: "",
  officialWebsiteUrl: "",
  description: "",
  faqs: [],
  status: "published",
  featured: false,
  metaTitle: "",
  metaDescription: ""
};

function toDateInput(v) {
  if (!v) return "";
  return new Date(v).toISOString().slice(0, 10);
}

export default function JobForm({ initialJob, jobId }) {
  const router = useRouter();
  const [job, setJob] = useState(() => {
    if (!initialJob) return EMPTY_JOB;
    return {
      ...EMPTY_JOB,
      ...initialJob,
      applicationStartDate: toDateInput(initialJob.applicationStartDate),
      lastDate: toDateInput(initialJob.lastDate),
      importantDates: (initialJob.importantDates || []).map((d) => ({ ...d, date: toDateInput(d.date) }))
    };
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const districts = job.state ? STATES[job.state] || [] : [];

  function set(field, value) {
    setJob((j) => ({ ...j, [field]: value }));
  }

  function updateArrayItem(field, index, key, value) {
    setJob((j) => {
      const arr = [...j[field]];
      arr[index] = { ...arr[index], [key]: value };
      return { ...j, [field]: arr };
    });
  }

  function addArrayItem(field, template) {
    setJob((j) => ({ ...j, [field]: [...j[field], template] }));
  }

  function removeArrayItem(field, index) {
    setJob((j) => ({ ...j, [field]: j[field].filter((_, i) => i !== index) }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const payload = {
      ...job,
      totalVacancy: Number(job.totalVacancy) || 0,
      ageMin: job.ageMin ? Number(job.ageMin) : undefined,
      ageMax: job.ageMax ? Number(job.ageMax) : undefined
    };

    const url = jobId ? `/api/jobs/${jobId}` : "/api/jobs";
    const method = jobId ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setSaving(false);

    if (res.ok) {
      router.push("/admin/dashboard");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error || "Save failed");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <p className="text-sm text-danger bg-danger/5 border border-danger/20 rounded-md px-3 py-2">{error}</p>
      )}

      <FormSection title="মূল তথ্য">
        <Field label="Job Title *">
          <input required value={job.title} onChange={(e) => set("title", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Organization *">
          <input required value={job.organization} onChange={(e) => set("organization", e.target.value)} className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Category">
            <select value={job.category} onChange={(e) => set("category", e.target.value)} className={inputCls}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="Job Type">
            <select value={job.jobType} onChange={(e) => set("jobType", e.target.value)} className={inputCls}>
              {JOB_TYPES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="State">
            <select value={job.state} onChange={(e) => { set("state", e.target.value); set("district", ""); }} className={inputCls}>
              {STATE_NAMES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
          <Field label="District">
            <select value={job.district} onChange={(e) => set("district", e.target.value)} className={inputCls}>
              <option value="">— নেই —</option>
              {districts.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
          </Field>
        </div>
        <Field label="Total Vacancy">
          <input type="number" value={job.totalVacancy} onChange={(e) => set("totalVacancy", e.target.value)} className={inputCls} />
        </Field>
      </FormSection>

      <FormSection title="Vacancy Details (post-wise)">
        {job.vacancyDetails.map((v, i) => (
          <div key={i} className="grid grid-cols-[1fr_100px_1fr_auto] gap-2 mb-2 items-center">
            <input placeholder="Post name" value={v.postName || ""} onChange={(e) => updateArrayItem("vacancyDetails", i, "postName", e.target.value)} className={inputCls} />
            <input placeholder="Count" type="number" value={v.count || ""} onChange={(e) => updateArrayItem("vacancyDetails", i, "count", e.target.value)} className={inputCls} />
            <input placeholder="Eligibility" value={v.eligibility || ""} onChange={(e) => updateArrayItem("vacancyDetails", i, "eligibility", e.target.value)} className={inputCls} />
            <button type="button" onClick={() => removeArrayItem("vacancyDetails", i)} className="text-danger text-sm">✕</button>
          </div>
        ))}
        <AddButton onClick={() => addArrayItem("vacancyDetails", { postName: "", count: "", eligibility: "" })}>
          + Post যোগ করুন
        </AddButton>
      </FormSection>

      <FormSection title="Eligibility">
        <Field label="Education Required (headline) *">
          <input required value={job.educationRequired} onChange={(e) => set("educationRequired", e.target.value)} className={inputCls} placeholder="e.g. 12th Pass / Graduate" />
        </Field>
        <Field label="Eligibility Details">
          <textarea rows={3} value={job.eligibilityDetails} onChange={(e) => set("eligibilityDetails", e.target.value)} className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Min Age">
            <input type="number" value={job.ageMin} onChange={(e) => set("ageMin", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Max Age">
            <input type="number" value={job.ageMax} onChange={(e) => set("ageMax", e.target.value)} className={inputCls} />
          </Field>
        </div>
        <Field label="Age Relaxation">
          <input value={job.ageRelaxation} onChange={(e) => set("ageRelaxation", e.target.value)} className={inputCls} placeholder="e.g. OBC +3, SC/ST +5 years" />
        </Field>
      </FormSection>

      <FormSection title="Salary ও তারিখ">
        <Field label="Salary">
          <input value={job.salary} onChange={(e) => set("salary", e.target.value)} className={inputCls} placeholder="e.g. Rs. 25,500 - 81,100" />
        </Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Application Start Date">
            <input type="date" value={job.applicationStartDate} onChange={(e) => set("applicationStartDate", e.target.value)} className={inputCls} />
          </Field>
          <Field label="Last Date *">
            <input required type="date" value={job.lastDate} onChange={(e) => set("lastDate", e.target.value)} className={inputCls} />
          </Field>
        </div>

        {job.importantDates.map((d, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 mb-2 items-center">
            <input placeholder="Label e.g. Exam Date" value={d.label || ""} onChange={(e) => updateArrayItem("importantDates", i, "label", e.target.value)} className={inputCls} />
            <input type="date" value={d.date || ""} onChange={(e) => updateArrayItem("importantDates", i, "date", e.target.value)} className={inputCls} />
            <button type="button" onClick={() => removeArrayItem("importantDates", i)} className="text-danger text-sm">✕</button>
          </div>
        ))}
        <AddButton onClick={() => addArrayItem("importantDates", { label: "", date: "" })}>
          + Important Date যোগ করুন
        </AddButton>
      </FormSection>

      <FormSection title="Application">
        <Field label="Application Fee">
          <textarea rows={2} value={job.applicationFee} onChange={(e) => set("applicationFee", e.target.value)} className={inputCls} />
        </Field>
        <Field label="How to Apply">
          <textarea rows={4} value={job.howToApply} onChange={(e) => set("howToApply", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Apply Online URL">
          <input value={job.applyOnlineUrl} onChange={(e) => set("applyOnlineUrl", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Official Notification URL">
          <input value={job.officialNotificationUrl} onChange={(e) => set("officialNotificationUrl", e.target.value)} className={inputCls} />
        </Field>
        <Field label="Official Website URL">
          <input value={job.officialWebsiteUrl} onChange={(e) => set("officialWebsiteUrl", e.target.value)} className={inputCls} />
        </Field>
      </FormSection>

      <FormSection title="বিস্তারিত বর্ণনা">
        <Field label="Description">
          <textarea rows={6} value={job.description} onChange={(e) => set("description", e.target.value)} className={inputCls} />
        </Field>
      </FormSection>

      <FormSection title="FAQ">
        {job.faqs.map((f, i) => (
          <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 mb-2 items-start">
            <input placeholder="Question" value={f.question || ""} onChange={(e) => updateArrayItem("faqs", i, "question", e.target.value)} className={inputCls} />
            <textarea placeholder="Answer" rows={2} value={f.answer || ""} onChange={(e) => updateArrayItem("faqs", i, "answer", e.target.value)} className={inputCls} />
            <button type="button" onClick={() => removeArrayItem("faqs", i)} className="text-danger text-sm">✕</button>
          </div>
        ))}
        <AddButton onClick={() => addArrayItem("faqs", { question: "", answer: "" })}>
          + FAQ যোগ করুন
        </AddButton>
      </FormSection>

      <FormSection title="SEO (Google ranking)">
        <Field label="Meta Title">
          <input value={job.metaTitle} onChange={(e) => set("metaTitle", e.target.value)} className={inputCls} placeholder="খালি রাখলে অটো তৈরি হবে" />
        </Field>
        <Field label="Meta Description">
          <textarea rows={2} value={job.metaDescription} onChange={(e) => set("metaDescription", e.target.value)} className={inputCls} />
        </Field>
        <div className="flex items-center gap-3">
          <Field label="Status">
            <select value={job.status} onChange={(e) => set("status", e.target.value)} className={inputCls}>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </Field>
          <label className="flex items-center gap-2 text-sm mt-6">
            <input type="checkbox" checked={job.featured} onChange={(e) => set("featured", e.target.checked)} />
            Featured
          </label>
        </div>
      </FormSection>

      <div className="flex gap-3 sticky bottom-0 bg-paper py-4">
        <button type="submit" disabled={saving} className="bg-navy text-white font-semibold text-sm rounded-md px-6 py-2.5 hover:bg-navy-700 disabled:opacity-60">
          {saving ? "Saving..." : jobId ? "Update Job" : "Publish Job"}
        </button>
        <button type="button" onClick={() => router.push("/admin/dashboard")} className="text-sm font-medium text-ink/60 px-4">
          বাতিল করুন
        </button>
      </div>
    </form>
  );
}

const inputCls = "w-full rounded-md border border-line px-3 py-2 text-sm outline-none focus:border-navy bg-white";

function FormSection({ title, children }) {
  return (
    <div className="bg-white border border-line rounded-card p-5">
      <h3 className="font-display font-semibold text-sm mb-4">{title}</h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-ink/50 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function AddButton({ onClick, children }) {
  return (
    <button type="button" onClick={onClick} className="text-sm font-medium text-navy border border-navy/25 rounded-md px-3 py-1.5 hover:bg-navy-50">
      {children}
    </button>
  );
}
