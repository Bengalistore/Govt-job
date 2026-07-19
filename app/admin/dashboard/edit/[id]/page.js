import { connectDB } from "@/lib/mongodb";
import Job from "@/models/Job";
import JobForm from "@/components/admin/JobForm";
import { notFound } from "next/navigation";

export default async function EditJobPage({ params }) {
  await connectDB();
  const job = await Job.findById(params.id).lean();
  if (!job) notFound();

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display font-bold text-xl mb-6">Job Edit করুন</h1>
      <JobForm initialJob={JSON.parse(JSON.stringify(job))} jobId={params.id} />
    </div>
  );
}
