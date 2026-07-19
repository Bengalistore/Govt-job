import JobForm from "@/components/admin/JobForm";

export default function NewJobPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="font-display font-bold text-xl mb-6">নতুন Job যোগ করুন</h1>
      <JobForm />
    </div>
  );
}
