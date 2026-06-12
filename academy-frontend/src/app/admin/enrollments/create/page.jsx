"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";

import { getStudents } from "@/services/admin/studentService";
import { getBatches } from "@/services/admin/batchService";
import { createEnrollment } from "@/services/admin/enrollmentService";

export default function CreateEnrollmentPage() {
  const router = useRouter();

  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const [formData, setFormData] = useState({
    student: "",
    batch: ""
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsFetching(true);
      const [studentsData, batchesData] = await Promise.all([
        getStudents(),
        getBatches()
      ]);
      setStudents(studentsData.data);
      setBatches(batchesData.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsFetching(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      await createEnrollment(formData);
      router.push("/admin/enrollments");
    } catch (error) {
      alert(error.response?.data?.message || "Failed to create enrollment");
    } finally {
      setLoading(false);
    }
  };

  // Base input styling for consistency and theme compatibility
  const inputStyle = "w-full px-4 py-2.5 rounded-lg border border-border-custom bg-transparent text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-shadow appearance-none cursor-pointer";
  
  // Label styling
  const labelStyle = "block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5";

  return (
    <DashboardLayout role="ADMIN">
      <div className="max-w-3xl">
        
        {/* BACK BUTTON */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 mb-6 text-sm font-medium transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Enrollments
        </button>

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Create Enrollment
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Manually assign a student to an academic batch.
          </p>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="bg-card border border-border-custom rounded-2xl p-6 md:p-8 space-y-6 shadow-sm"
        >
          {/* STUDENT SELECT */}
          <div>
            <label className={labelStyle}>Select Student</label>
            <div className="relative">
              <select
                name="student"
                value={formData.student}
                onChange={handleChange}
                className={inputStyle}
                disabled={isFetching}
                required
              >
                <option value="" className="bg-background text-foreground">
                  {isFetching ? "Loading students..." : "-- Select a Student --"}
                </option>
                {students.map((student) => (
                  <option 
                    key={student._id} 
                    value={student._id}
                    className="bg-background text-foreground"
                  >
                    {student.userId?.fullName} {student.enrollmentNo ? `(${student.enrollmentNo})` : ""}
                  </option>
                ))}
              </select>
              {/* Custom Dropdown Arrow (since appearance is none) */}
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-slate-400">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          {/* BATCH SELECT */}
          <div>
            <label className={labelStyle}>Select Batch</label>
            <div className="relative">
              <select
                name="batch"
                value={formData.batch}
                onChange={handleChange}
                className={inputStyle}
                disabled={isFetching}
                required
              >
                <option value="" className="bg-background text-foreground">
                  {isFetching ? "Loading batches..." : "-- Select an Active Batch --"}
                </option>
                {batches.map((batch) => (
                  <option 
                    key={batch._id} 
                    value={batch._id}
                    className="bg-background text-foreground"
                  >
                    {batch.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-500 dark:text-slate-400">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
              </div>
            </div>
          </div>

          {/* SUBMIT BUTTON */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading || isFetching}
              className="w-full flex justify-center items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-6 py-3 rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={18} />
              ) : (
                <Save size={18} />
              )}
              {loading ? "Creating Enrollment..." : "Create Enrollment"}
            </button>
          </div>
        </form>

      </div>
    </DashboardLayout>
  );
}