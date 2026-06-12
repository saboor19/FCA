"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { 
  Plus, 
  Trash2, 
  Pencil, 
  Eye, 
  User, 
  Briefcase 
} from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import {
  getTeachers,
  deleteTeacher
} from "@/services/admin/teacherService";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeachers = async () => {
    try {
      const data = await getTeachers();
      setTeachers(data.data);
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch teachers"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Deactivate this teacher?");

    if (!confirmDelete) return;

    try {
      await deleteTeacher(id);
      toast.success("Teacher deactivated");
      fetchTeachers();
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Delete failed"
      );
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="ADMIN">
        <div className="flex min-h-[400px] items-center justify-center">
          <p className="text-slate-500 dark:text-slate-400">Loading teachers...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADMIN">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Manage Teachers
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            View and manage academy teachers.
          </p>
        </div>

        <Link
          href="/admin/teachers/create"
          className="flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition"
        >
          <Plus size={16} />
          Add Teacher
        </Link>
      </div>

      {teachers.length === 0 ? (
        <div className="bg-card p-6 rounded-2xl border border-border-custom shadow-sm text-slate-500 dark:text-slate-400 text-center">
          No teachers found.
        </div>
      ) : (
        <div className="bg-card border border-border-custom rounded-2xl shadow-sm overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-border-custom">
                {[
                  "Teacher",
                  "Employee ID",
                  "Specialization",
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
              {teachers.map((teacher) => (
                <tr
                  key={teacher._id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                >
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-foreground flex items-center gap-2">
                        <User size={15} className="text-slate-400" />
                        {teacher.userId?.fullName}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400 ml-6">
                        {teacher.userId?.email}
                      </p>
                    </div>
                  </td>

                  <td className="p-4 text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2">
                      <Briefcase size={14} className="text-slate-400" />
                      {teacher.employeeId}
                    </div>
                  </td>

                  <td className="p-4 text-slate-600 dark:text-slate-300">
                    {teacher.specialization || "N/A"}
                  </td>

                  <td className="p-4">
                    <span
                      className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
                        teacher.userId?.isActive
                          ? "bg-green-100 border-green-200 text-green-700 dark:bg-green-400/10 dark:border-green-400/20 dark:text-green-400"
                          : "bg-slate-100 border-slate-200 text-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-400"
                      }`}
                    >
                      {teacher.userId?.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Link
                        href={`/admin/teachers/${teacher._id}`}
                        className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </Link>

                      <Link
                        href={`/admin/teachers/edit/${teacher._id}`}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
                        title="Edit Teacher"
                      >
                        <Pencil size={18} />
                      </Link>

                      <button
                        onClick={() => handleDelete(teacher._id)}
                        className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 p-2 hover:bg-red-50 dark:hover:bg-red-900/30 rounded-lg transition"
                        title="Deactivate Teacher"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DashboardLayout>
  );
}