"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { CATEGORIES, JOB_TYPES, STATE_NAMES, STATES } from "@/lib/data";

const EDUCATION_LEVELS = [
  "8th Pass",
  "10th Pass",
  "12th Pass",
  "Diploma",
  "Graduate",
  "Post Graduate",
  "B.Tech / Engineering",
  "ITI"
];

export default function FilterSidebar() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [state, setState] = useState(searchParams.get("state") || "");
  const districts = state ? STATES[state] || [] : [];

  function updateParam(key, value) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (key === "state") params.delete("district");
    router.push(`/search?${params.toString()}`);
  }

  function FilterGroup({ label, id, options, paramKey, currentValue }) {
    return (
      <div className="mb-5">
        <label htmlFor={id} className="block text-xs font-semibold uppercase tracking-wide text-ink/50 mb-1.5">
          {label}
        </label>
        <select
          id={id}
          value={currentValue}
          onChange={(e) => updateParam(paramKey, e.target.value)}
          className="w-full rounded-md border border-line bg-white text-sm px-3 py-2 outline-none focus:border-navy"
        >
          <option value="">সব {label}</option>
          {options.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <aside className="bg-white border border-line rounded-card p-4 sm:p-5 h-fit sticky top-20">
      <h3 className="font-display font-semibold text-sm mb-4">Filter করুন</h3>

      <FilterGroup
        label="Category"
        id="f-category"
        options={CATEGORIES}
        paramKey="category"
        currentValue={searchParams.get("category") || ""}
      />

      <FilterGroup
        label="Job Type"
        id="f-jobtype"
        options={JOB_TYPES}
        paramKey="jobType"
        currentValue={searchParams.get("jobType") || ""}
      />

      <div className="mb-5">
        <label htmlFor="f-state" className="block text-xs font-semibold uppercase tracking-wide text-ink/50 mb-1.5">
          State
        </label>
        <select
          id="f-state"
          value={state}
          onChange={(e) => {
            setState(e.target.value);
            updateParam("state", e.target.value);
          }}
          className="w-full rounded-md border border-line bg-white text-sm px-3 py-2 outline-none focus:border-navy"
        >
          <option value="">সব State</option>
          {STATE_NAMES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {districts.length > 0 && (
        <FilterGroup
          label="District"
          id="f-district"
          options={districts}
          paramKey="district"
          currentValue={searchParams.get("district") || ""}
        />
      )}

      <FilterGroup
        label="Education"
        id="f-education"
        options={EDUCATION_LEVELS}
        paramKey="education"
        currentValue={searchParams.get("education") || ""}
      />

      <button
        onClick={() => router.push("/search")}
        className="w-full text-sm font-medium text-navy border border-navy/25 rounded-md py-2 hover:bg-navy-50 transition-colors"
      >
        Filter Reset করুন
      </button>
    </aside>
  );
}
