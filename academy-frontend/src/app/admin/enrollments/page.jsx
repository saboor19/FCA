"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Trash2,
  GraduationCap,
  BookOpen,
  Calendar
} from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AcademyLoader from "@/components/ui/AcademyLoader";

import {
  getEnrollments,
  deleteEnrollment
} from "@/services/admin/enrollmentService";

export default function EnrollmentsPage() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnrollments();
  }, []);

  const fetchEnrollments = async () => {
    try {
      const response = await getEnrollments();
      setEnrollments(response.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this enrollment?");
    if (!confirmed) return;

    try {
      await deleteEnrollment(id);
      fetchEnrollments();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete enrollment");
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="ADMIN">
        <AcademyLoader text="Fetching Enrollments..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADMIN">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Manage Enrollments
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Assign and manage student batch enrollments.
          </p>
        </div>

        <Link
          href="/admin/enrollments/create"
          className="flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition"
        >
          <Plus size={16} />
          Add Enrollment
        </Link>
      </div>

      <div className="bg-card border border-border-custom rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-border-custom">
              {[
                "Student",
                "Batch",
                "Enrolled At",
                "Status",
                "Actions"
              ].map((head) => (
                <th
                  key={head}
                  className="p-4 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-border-custom">
            {enrollments.map((enrollment) => (
              <tr
                key={enrollment._id}
                className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
              >
                {/* STUDENT */}
                <td className="p-4">
                  <div>
                    <p className="font-medium text-foreground flex items-center gap-2">
                      <GraduationCap size={15} className="text-slate-400" />
                      {enrollment.student?.userId?.fullName}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 ml-6">
                      {enrollment.student?.enrollmentNo}
                    </p>
                  </div>
                </td>

                {/* BATCH */}
                <td className="p-4 text-slate-700 dark:text-slate-300">
                  <div className="flex items-center gap-2">
                    <BookOpen size={15} className="text-slate-400" />
                    {enrollment.batch?.name}
                  </div>
                </td>

                {/* ENROLLED AT */}
                <td className="p-4 text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={15} className="text-slate-400" />
                    {new Date(enrollment.enrolledAt).toLocaleDateString()}
                  </div>
                </td>

                {/* STATUS */}
                <td className="p-4">
                  {/* Flattened string for hydration safety */}
                  <span
                    className={`px-2.5 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase border ${enrollment.status === "ACTIVE" ? "bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-400/10 dark:border-emerald-400/20 dark:text-emerald-400" : enrollment.status === "COMPLETED" ? "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-400/10 dark:border-blue-400/20 dark:text-blue-400" : "bg-red-50 border-red-200 text-red-700 dark:bg-red-400/10 dark:border-red-400/20 dark:text-red-400"}`}
                  >
                    {enrollment.status}
                  </span>
                </td>

                {/* ACTIONS */}
                <td className="p-4">
                  <button
                    onClick={() => handleDelete(enrollment._id)}
                    className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                    title="Delete Enrollment"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {enrollments.length === 0 && (
          <div className="p-10 text-center text-slate-500 dark:text-slate-400">
            No enrollments found.
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}