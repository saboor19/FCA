"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AcademyLoader from "@/components/ui/AcademyLoader";
import { getCourses, deleteCourse } from "@/services/admin/courseService";
import CourseCard from "@/components/CourseCard";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Delete this course?");
    if (!confirmDelete) return;

    try {
      await deleteCourse(id);
      fetchCourses();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Failed to delete course");
    }
  };

  if (loading) {
    return (
      <DashboardLayout role="ADMIN">
        <AcademyLoader text="Fetching Courses..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADMIN">
      {/* Header - Clean, no gradients */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Courses</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage academy courses and curriculum.
          </p>
        </div>

        <Link
          href="/admin/courses/create"
          className="inline-flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm shrink-0"
        >
          <Plus size={18} />
          Create Course
        </Link>
      </div>

      {/* Courses Grid */}
      {courses.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border-custom border-dashed rounded-2xl">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mb-4 text-slate-400">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          </div>
          <h3 className="text-lg font-medium text-foreground">No courses yet</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1 mb-6">
            Get started by creating your first course.
          </p>
          <Link
            href="/admin/courses/create"
            className="inline-flex items-center gap-2 bg-card border border-border-custom px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
          >
            <Plus size={16} />
            Create Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course._id}
              course={course}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}