import EnrollmentForm from "@/components/public/EnrollmentForm";

export const metadata = {
  title: "Enroll Now | Fusion Code Academy",
};

export default function EnrollPage() {
  return (
    <main className="min-h-screen pt-32 pb-20 bg-white dark:bg-slate-950">
      <div className="max-w-6xl mx-auto px-6">

        <div className="text-center mb-12">
          <span className="inline-flex items-center rounded-full bg-yellow-100 dark:bg-yellow-500/10 px-4 py-1 text-sm font-medium text-yellow-700 dark:text-yellow-400">
            Admissions Open
          </span>

          <h1 className="mt-6 text-4xl md:text-5xl font-black text-slate-900 dark:text-white">
            Apply For Admission
          </h1>

          <p className="mt-4 text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Fill out the application form below. Our admissions team will review
            your request and contact you shortly.
          </p>
        </div>

        <EnrollmentForm />

      </div>
    </main>
  );
}