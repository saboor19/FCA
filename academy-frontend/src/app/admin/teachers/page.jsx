"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Plus, Users } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import TeacherCard from "@/components/teachers/TeacherCard";
import { getTeachers, deleteTeacher } from "@/services/admin/teacherService";

export default function TeachersPage() {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeachers = async () => {
    try {
      const data = await getTeachers();
      setTeachers(data.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch teachers");
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
      toast.error(error.response?.data?.message || "Delete failed");
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
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Teachers</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            View and manage academy teaching staff.
          </p>
        </div>

        <Link
          href="/admin/teachers/create"
          className="inline-flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm shrink-0"
        >
          <Plus size={18} />
          Add Teacher
        </Link>
      </div>

      {/* Teachers Grid */}
      {teachers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border-custom border-dashed rounded-2xl">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mb-4 text-slate-400">
            <Users size={32} />
          </div>
          <h3 className="text-lg font-medium text-foreground">No teachers yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1 mb-6">
            Get started by adding your first teacher.
          </p>
          <Link
            href="/admin/teachers/create"
            className="inline-flex items-center gap-2 bg-card border border-border-custom px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <Plus size={16} />
            Add Teacher
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {teachers.map((teacher) => (
            <TeacherCard key={teacher._id} teacher={teacher} onDelete={handleDelete} />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}