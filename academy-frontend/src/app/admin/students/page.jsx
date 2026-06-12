"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Plus, Users, Search, X } from "lucide-react";

import DashboardLayout from "@/components/dashboard/DashboardLayout";
import AcademyLoader from "@/components/ui/AcademyLoader";
import StudentCard from "@/components/students/StudentCard";

import { getStudents, deleteStudent } from "@/services/admin/studentService";
import { getBatches } from "@/services/admin/batchService";
import { getCourses } from "@/services/admin/courseService";

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [batches, setBatches] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBatchIds, setSelectedBatchIds] = useState([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState([]);

  const fetchData = async () => {
    try {
      const [studentsRes, batchesRes, coursesRes] = await Promise.all([
        getStudents(),
        getBatches(),
        getCourses(),
      ]);

      setStudents(studentsRes.data || []);
      setBatches(batchesRes.data || []);
      setCourses(coursesRes.data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this student?");
    if (!confirmed) return;

    try {
      await deleteStudent(id);
      fetchData(); // Refresh all data
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete student");
    }
  };

  // --- Filtering Logic ---

  // Fuzzy search across student name, email, enrollmentNo
  const filteredBySearch = useMemo(() => {
    if (!searchQuery.trim()) return students;

    const query = searchQuery.toLowerCase().trim();
    return students.filter((student) => {
      const fullName = student.userId?.fullName?.toLowerCase() || "";
      const email = student.userId?.email?.toLowerCase() || "";
      const enrollmentNo = student.enrollmentNo?.toLowerCase() || "";
      return fullName.includes(query) || email.includes(query) || enrollmentNo.includes(query);
    });
  }, [students, searchQuery]);

  // Filter by selected batches
  const filteredByBatch = useMemo(() => {
    if (selectedBatchIds.length === 0) return filteredBySearch;

    return filteredBySearch.filter((student) => {
      const studentBatchIds = student.batches?.map((b) => b._id || b) || [];
      return selectedBatchIds.some((batchId) => studentBatchIds.includes(batchId));
    });
  }, [filteredBySearch, selectedBatchIds]);

  // Filter by selected courses (students enrolled in batches that belong to these courses)
  const filteredByCourse = useMemo(() => {
    if (selectedCourseIds.length === 0) return filteredByBatch;

    // Create a map of batch -> course for quick lookup
    const batchCourseMap = new Map();
    batches.forEach((batch) => {
      batchCourseMap.set(batch._id, batch.course?._id || batch.course);
    });

    return filteredByBatch.filter((student) => {
      const studentBatchIds = student.batches?.map((b) => b._id || b) || [];
      // Check if any of student's batches belong to selected courses
      return studentBatchIds.some((batchId) => {
        const courseId = batchCourseMap.get(batchId);
        return selectedCourseIds.includes(courseId);
      });
    });
  }, [filteredByBatch, selectedCourseIds, batches]);

  const filteredStudents = filteredByCourse;

  // Toggle batch selection
  const toggleBatch = (batchId) => {
    setSelectedBatchIds((prev) =>
      prev.includes(batchId) ? prev.filter((id) => id !== batchId) : [...prev, batchId]
    );
  };

  // Toggle course selection
  const toggleCourse = (courseId) => {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId) ? prev.filter((id) => id !== courseId) : [...prev, courseId]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedBatchIds([]);
    setSelectedCourseIds([]);
  };

  const hasActiveFilters = searchQuery || selectedBatchIds.length > 0 || selectedCourseIds.length > 0;

  if (loading) {
    return (
      <DashboardLayout role="ADMIN">
        <AcademyLoader text="Loading Student Database..." />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="ADMIN">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Manage Students</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            View, edit, and manage all academy students.
          </p>
        </div>
        <Link
          href="/admin/students/create"
          className="flex items-center gap-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors shadow-sm shrink-0"
        >
          <Plus size={18} />
          Add Student
        </Link>
      </div>

      {/* FILTERS SECTION */}
      <div className="mb-8 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by name, email, or enrollment number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border-custom bg-card text-foreground placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20"
          />
        </div>

        {/* Batch Pills */}
        {batches.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mr-1">
              Batches:
            </span>
            <div className="flex flex-wrap gap-2">
              {batches.map((batch) => (
                <button
                  key={batch._id}
                  onClick={() => toggleBatch(batch._id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedBatchIds.includes(batch._id)
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {batch.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Course Pills */}
        {courses.length > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm font-medium text-slate-500 dark:text-slate-400 mr-1">
              Courses:
            </span>
            <div className="flex flex-wrap gap-2">
              {courses.map((course) => (
                <button
                  key={course._id}
                  onClick={() => toggleCourse(course._id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                    selectedCourseIds.includes(course._id)
                      ? "bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  {course.title}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Active Filters & Clear Button */}
        {hasActiveFilters && (
          <div className="flex items-center justify-between pt-2 border-t border-border-custom">
            <p className="text-sm text-slate-500">
              Showing {filteredStudents.length} of {students.length} students
            </p>
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
            >
              <X size={14} />
              Clear all filters
            </button>
          </div>
        )}
      </div>

      {/* STUDENT GRID */}
      {filteredStudents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredStudents.map((student) => (
            <StudentCard key={student._id} student={student} onDelete={handleDelete} />
          ))}
        </div>
      ) : (
        /* EMPTY STATE */
        <div className="flex flex-col items-center justify-center py-20 text-center bg-card border border-border-custom border-dashed rounded-2xl">
          <div className="w-16 h-16 bg-slate-50 dark:bg-slate-900/50 rounded-full flex items-center justify-center mb-4 text-slate-400">
            <Users size={32} />
          </div>
          <h3 className="text-lg font-medium text-foreground">No Students Found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1 mb-6 max-w-sm">
            {hasActiveFilters
              ? "No students match the selected filters. Try clearing them."
              : "Your academy doesn't have any registered students yet. Get started by adding one."}
          </p>
          {!hasActiveFilters && (
            <Link
              href="/admin/students/create"
              className="inline-flex items-center gap-2 bg-card border border-border-custom text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 px-5 py-2.5 rounded-xl transition-colors text-sm font-medium"
            >
              <Plus size={16} />
              Add First Student
            </Link>
          )}
        </div>
      )}
    </DashboardLayout>
  );
}